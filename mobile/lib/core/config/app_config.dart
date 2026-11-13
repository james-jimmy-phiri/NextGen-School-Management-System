class AppConfig {
  AppConfig._();

  static const String appName = 'NextGen School OS';
  static const String appVersion = '0.1.0';

  /// Default API base URL. Can be overridden at build/run time via:
  /// `flutter run --dart-define=API_BASE_URL=http://YOUR_SERVER_IP:8000/api/v1`
  static const String defaultApiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://192.168.1.167:8000/api/v1',
  );

  /// Local development fallback for web or desktop
  static const String localHostApiBaseUrl = 'http://192.168.1.167:8000/api/v1';

  // Network timeouts
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);

  // Secure Storage keys
  static const String storageTokenKey = 'ngms_auth_token';
  static const String storageUserKey = 'ngms_cached_user';
  static const String storageLastLoginKey = 'ngms_last_login';
  static const String storageActiveRoleKey = 'ngms_active_role';
  static const String storageBaseUrlKey = 'ngms_api_base_url';

  // Hive Box names
  static const String authBoxName = 'auth_box';
  static const String attendanceBoxName = 'attendance_offline_box';
  static const String cacheBoxName = 'app_cache_box';
}

