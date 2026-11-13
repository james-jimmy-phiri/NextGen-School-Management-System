import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/app_config.dart';

class SecureStorageService {
  final FlutterSecureStorage _storage;

  SecureStorageService([FlutterSecureStorage? storage])
      : _storage = storage ??
            const FlutterSecureStorage(
              aOptions: AndroidOptions(encryptedSharedPreferences: true),
            );

  Future<void> saveToken(String token) async {
    await _storage.write(key: AppConfig.storageTokenKey, value: token);
  }

  Future<String?> getToken() async {
    return _storage.read(key: AppConfig.storageTokenKey);
  }

  Future<void> deleteToken() async {
    await _storage.delete(key: AppConfig.storageTokenKey);
  }

  Future<void> saveLastLogin(String identifier) async {
    await _storage.write(key: AppConfig.storageLastLoginKey, value: identifier);
  }

  Future<String?> getLastLogin() async {
    return _storage.read(key: AppConfig.storageLastLoginKey);
  }

  Future<void> saveActiveRole(String role) async {
    await _storage.write(key: AppConfig.storageActiveRoleKey, value: role);
  }

  Future<String?> getActiveRole() async {
    return _storage.read(key: AppConfig.storageActiveRoleKey);
  }

  Future<void> saveCustomBaseUrl(String url) async {
    await _storage.write(key: AppConfig.storageBaseUrlKey, value: url);
  }

  Future<String?> getCustomBaseUrl() async {
    return _storage.read(key: AppConfig.storageBaseUrlKey);
  }

  Future<void> clearAll() async {
    await _storage.delete(key: AppConfig.storageTokenKey);
    await _storage.delete(key: AppConfig.storageUserKey);
    await _storage.delete(key: AppConfig.storageActiveRoleKey);
  }
}

