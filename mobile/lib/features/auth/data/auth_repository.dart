import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/storage/hive_service.dart';
import '../../../core/storage/secure_storage_service.dart';
import 'models/user_model.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final dio = ref.watch(dioProvider);
  final storage = ref.watch(secureStorageProvider);
  return AuthRepository(dio: dio, storage: storage);
});

class AuthRepository {
  final Dio _dio;
  final SecureStorageService _storage;

  AuthRepository({
    required Dio dio,
    required SecureStorageService storage,
  })  : _dio = dio,
        _storage = storage;

  /// Authenticates using either email or phone number + password
  Future<({String token, UserModel user})> login({
    required String identifier,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.login,
        data: {
          'login': identifier.trim(),
          'password': password,
          'device_name': 'NextGen Mobile Companion',
        },
      );

      final data = response.data as Map<String, dynamic>;
      
      // Handle both flat and nested 'data' payload formats
      final payload = (data['data'] is Map<String, dynamic>)
          ? data['data'] as Map<String, dynamic>
          : data;

      final token = payload['token'] as String? ?? '';
      final rawUser = payload['user'] as Map<String, dynamic>? ?? {};

      if (token.isEmpty) {
        throw const ApiException(message: 'Authentication token missing from response.');
      }

      final user = UserModel.fromJson(rawUser);

      // Persist token and cache user data
      await _storage.saveToken(token);
      await _storage.saveLastLogin(identifier.trim());
      await HiveService.cacheUserData(user.toJson());

      return (token: token, user: user);
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  /// Refreshes current user's profile from the backend
  Future<UserModel> getProfile() async {
    try {
      final response = await _dio.get(ApiEndpoints.me);
      final data = response.data;

      Map<String, dynamic> rawUser;
      if (data is Map<String, dynamic> && data['data'] is Map<String, dynamic>) {
        rawUser = data['data'] as Map<String, dynamic>;
      } else if (data is Map<String, dynamic>) {
        rawUser = data;
      } else {
        throw const ApiException(message: 'Invalid profile data returned.');
      }

      final user = UserModel.fromJson(rawUser);
      await HiveService.cacheUserData(user.toJson());
      return user;
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  /// Revokes active Sanctum token and clears local state
  Future<void> logout() async {
    try {
      await _dio.post(ApiEndpoints.logout);
    } catch (_) {
      // Ignore network errors on logout to allow offline sign out
    } finally {
      await _storage.deleteToken();
      await HiveService.clearAuthCache();
    }
  }

  /// Loads locally cached user when offline
  UserModel? loadCachedUser() {
    final cached = HiveService.getCachedUserData();
    if (cached != null) {
      return UserModel.fromJson(cached);
    }
    return null;
  }

  Future<String?> getSavedToken() => _storage.getToken();

  Future<String?> getLastLogin() => _storage.getLastLogin();
}

