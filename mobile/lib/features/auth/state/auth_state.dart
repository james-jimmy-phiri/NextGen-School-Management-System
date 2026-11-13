import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/auth_repository.dart';
import '../data/models/user_model.dart';

enum AuthStatus {
  initial,
  loading,
  authenticated,
  unauthenticated,
  error,
}

class AuthState {
  final AuthStatus status;
  final UserModel? user;
  final String? token;
  final String? activeRole; // Active workspace role for multi-role users
  final String? errorMessage;

  const AuthState({
    this.status = AuthStatus.initial,
    this.user,
    this.token,
    this.activeRole,
    this.errorMessage,
  });

  bool get isAuthenticated => status == AuthStatus.authenticated && user != null;
  bool get isLoading => status == AuthStatus.loading;

  /// Effective role determining which workspace home is rendered
  String get effectiveRole {
    if (activeRole != null && activeRole!.isNotEmpty) {
      return activeRole!;
    }
    if (user != null) {
      if (user!.isParent) return 'parent';
      if (user!.isTeacher) return 'teacher';
      if (user!.isSchoolAdmin) return 'school_admin';
      if (user!.isSuperAdmin) return 'super_admin';
      if (user!.isStudent) return 'student';
      return user!.primaryRole ?? 'user';
    }
    return 'unauthenticated';
  }

  AuthState copyWith({
    AuthStatus? status,
    UserModel? user,
    String? token,
    String? activeRole,
    String? errorMessage,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      token: token ?? this.token,
      activeRole: activeRole ?? this.activeRole,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

final authStateProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return AuthNotifier(repository);
});

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  AuthNotifier(this._repository) : super(const AuthState()) {
    bootstrap();
  }

  /// Restores session on app startup
  Future<void> bootstrap() async {
    state = state.copyWith(status: AuthStatus.loading);

    try {
      final token = await _repository.getSavedToken();
      if (token == null || token.isEmpty) {
        state = const AuthState(status: AuthStatus.unauthenticated);
        return;
      }

      // Fast optimistic load from offline cache
      final cachedUser = _repository.loadCachedUser();
      if (cachedUser != null) {
        state = state.copyWith(
          status: AuthStatus.authenticated,
          user: cachedUser,
          token: token,
          activeRole: cachedUser.primaryRole,
        );
      }

      // Refresh latest profile from network
      try {
        final freshUser = await _repository.getProfile();
        state = state.copyWith(
          status: AuthStatus.authenticated,
          user: freshUser,
          token: token,
          activeRole: state.activeRole ?? freshUser.primaryRole,
        );
      } catch (e) {
        // If network failed but we had cached data, stay authenticated offline!
        if (cachedUser == null) {
          state = const AuthState(status: AuthStatus.unauthenticated);
        }
      }
    } catch (_) {
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  /// Authenticates using email or phone
  Future<void> login({
    required String identifier,
    required String password,
  }) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);

    try {
      final result = await _repository.login(
        identifier: identifier,
        password: password,
      );

      // Default active role
      String? initialRole;
      if (result.user.isParent) {
        initialRole = 'parent';
      } else if (result.user.isTeacher) {
        initialRole = 'teacher';
      } else if (result.user.isSchoolAdmin) {
        initialRole = 'school_admin';
      } else {
        initialRole = result.user.primaryRole;
      }

      state = state.copyWith(
        status: AuthStatus.authenticated,
        user: result.user,
        token: result.token,
        activeRole: initialRole,
        errorMessage: null,
      );
    } catch (e) {
      final message = e.toString().replaceAll('ApiException: ', '');
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: message,
      );
    }
  }

  /// Switch active workspace role for users who have multiple roles (e.g. Teacher & Parent)
  void switchActiveRole(String newRole) {
    if (state.user == null) return;
    if (state.user!.hasRole(newRole) || state.user!.isSuperAdmin) {
      state = state.copyWith(activeRole: newRole);
    }
  }

  /// Logs out and clears state
  Future<void> logout() async {
    state = state.copyWith(status: AuthStatus.loading);
    await _repository.logout();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }
}

