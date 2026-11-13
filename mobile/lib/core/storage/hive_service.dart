import 'dart:convert';
import 'package:hive_flutter/hive_flutter.dart';
import '../config/app_config.dart';

class HiveService {
  static Future<void> init() async {
    await Hive.initFlutter();
    await Hive.openBox<String>(AppConfig.authBoxName);
    await Hive.openBox<String>(AppConfig.cacheBoxName);
  }

  static Box<String> get authBox => Hive.box<String>(AppConfig.authBoxName);
  static Box<String> get cacheBox => Hive.box<String>(AppConfig.cacheBoxName);

  static Future<void> cacheUserData(Map<String, dynamic> userMap) async {
    await authBox.put(AppConfig.storageUserKey, jsonEncode(userMap));
  }

  static Map<String, dynamic>? getCachedUserData() {
    final raw = authBox.get(AppConfig.storageUserKey);
    if (raw == null) return null;
    try {
      return jsonDecode(raw) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  static Future<void> clearAuthCache() async {
    await authBox.delete(AppConfig.storageUserKey);
  }
}

