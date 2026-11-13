import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/config/app_config.dart';
import 'core/storage/hive_service.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/presentation/screens/login_screen.dart';
import 'features/auth/state/auth_state.dart';
import 'features/navigation/presentation/adaptive_home_router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive offline cache
  await HiveService.init();

  runApp(
    const ProviderScope(
      child: NextGenApp(),
    ),
  );
}

class NextGenApp extends StatelessWidget {
  const NextGenApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConfig.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const AuthGateScreen(),
    );
  }
}

class AuthGateScreen extends ConsumerWidget {
  const AuthGateScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);

    switch (authState.status) {
      case AuthStatus.initial:
      case AuthStatus.loading:
        // Render sleek splash / bootstrap loader while session is resolving
        return const Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.school_rounded,
                  size: 64,
                  color: AppTheme.primary,
                ),
                SizedBox(height: 20),
                Text(
                  'NextGen School OS',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.4,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Initializing session...',
                  style: TextStyle(fontSize: 13, color: AppTheme.textMutedLight),
                ),
                SizedBox(height: 28),
                SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(strokeWidth: 2.5),
                ),
              ],
            ),
          ),
        );

      case AuthStatus.authenticated:
        // Route dynamically to role-specific workspace (Parent, Teacher, Admin)
        return const AdaptiveHomeRouter();

      case AuthStatus.unauthenticated:
      case AuthStatus.error:
        // User needs to authenticate
        return const LoginScreen();
    }
  }
}
