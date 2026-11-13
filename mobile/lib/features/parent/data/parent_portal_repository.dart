import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/storage/hive_service.dart';
import 'models/child_academics_model.dart';
import 'models/child_attendance_model.dart';
import 'models/child_fees_model.dart';
import 'models/child_model.dart';
import 'models/child_timetable_model.dart';

final parentPortalRepositoryProvider = Provider<ParentPortalRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return ParentPortalRepository(dio);
});

class ParentPortalRepository {
  final Dio _dio;

  ParentPortalRepository(this._dio);

  static const String _childrenCacheKey = 'ngms_cached_children';

  /// Fetches all children linked to the authenticated guardian
  Future<List<ChildModel>> getChildren() async {
    try {
      final response = await _dio.get(ApiEndpoints.portalChildren);
      final data = response.data;

      List<dynamic> list = [];
      if (data is Map<String, dynamic> && data['data'] is List) {
        list = data['data'] as List<dynamic>;
      } else if (data is List) {
        list = data;
      }

      final children = list
          .map((item) => ChildModel.fromJson(item as Map<String, dynamic>))
          .toList();

      // Cache locally in Hive for offline access
      await HiveService.cacheBox.put(_childrenCacheKey, jsonEncode(list));

      return children;
    } catch (e) {
      // If offline, attempt to restore from cache
      final cachedRaw = HiveService.cacheBox.get(_childrenCacheKey);
      if (cachedRaw != null) {
        try {
          final cachedList = jsonDecode(cachedRaw) as List<dynamic>;
          return cachedList
              .map((item) => ChildModel.fromJson(item as Map<String, dynamic>))
              .toList();
        } catch (_) {}
      }

      throw ApiException.fromDioError(e);
    }
  }

  /// Fetches attendance history & summaries for a child
  Future<ChildAttendanceData> getChildAttendance(int studentId) async {
    final cacheKey = 'child_${studentId}_attendance';
    try {
      final response = await _dio.get(ApiEndpoints.portalChildAttendance(studentId));
      final data = response.data;

      Map<String, dynamic> payload = {};
      if (data is Map<String, dynamic> && data['data'] is Map<String, dynamic>) {
        payload = data['data'] as Map<String, dynamic>;
      } else if (data is Map<String, dynamic>) {
        payload = data;
      }

      final result = ChildAttendanceData.fromJson(payload);
      await HiveService.cacheBox.put(cacheKey, jsonEncode(payload));
      return result;
    } catch (e) {
      final cached = HiveService.cacheBox.get(cacheKey);
      if (cached != null) {
        try {
          return ChildAttendanceData.fromJson(jsonDecode(cached) as Map<String, dynamic>);
        } catch (_) {}
      }
      throw ApiException.fromDioError(e);
    }
  }

  /// Fetches subjects, continuous assessment marks, and term GPA for a child
  Future<ChildAcademicsData> getChildAcademics(int studentId) async {
    final cacheKey = 'child_${studentId}_academics';
    try {
      final response = await _dio.get(ApiEndpoints.portalChildAcademics(studentId));
      final data = response.data;

      Map<String, dynamic> payload = {};
      if (data is Map<String, dynamic> && data['data'] is Map<String, dynamic>) {
        payload = data['data'] as Map<String, dynamic>;
      } else if (data is Map<String, dynamic>) {
        payload = data;
      }

      final result = ChildAcademicsData.fromJson(payload);
      await HiveService.cacheBox.put(cacheKey, jsonEncode(payload));
      return result;
    } catch (e) {
      final cached = HiveService.cacheBox.get(cacheKey);
      if (cached != null) {
        try {
          return ChildAcademicsData.fromJson(jsonDecode(cached) as Map<String, dynamic>);
        } catch (_) {}
      }
      throw ApiException.fromDioError(e);
    }
  }

  /// Fetches invoices, balances, and payment history for a child
  Future<ChildFeesData> getChildFees(int studentId) async {
    final cacheKey = 'child_${studentId}_fees';
    try {
      final response = await _dio.get(ApiEndpoints.portalChildFees(studentId));
      final data = response.data;

      Map<String, dynamic> payload = {};
      if (data is Map<String, dynamic> && data['data'] is Map<String, dynamic>) {
        payload = data['data'] as Map<String, dynamic>;
      } else if (data is Map<String, dynamic>) {
        payload = data;
      }

      final result = ChildFeesData.fromJson(payload);
      await HiveService.cacheBox.put(cacheKey, jsonEncode(payload));
      return result;
    } catch (e) {
      final cached = HiveService.cacheBox.get(cacheKey);
      if (cached != null) {
        try {
          return ChildFeesData.fromJson(jsonDecode(cached) as Map<String, dynamic>);
        } catch (_) {}
      }
      throw ApiException.fromDioError(e);
    }
  }

  /// Fetches class timetable periods for a child
  Future<ChildTimetableData> getChildTimetable(int studentId) async {
    final cacheKey = 'child_${studentId}_timetable';
    try {
      final response = await _dio.get(ApiEndpoints.portalChildTimetable(studentId));
      final data = response.data;

      Map<String, dynamic> payload = {};
      if (data is Map<String, dynamic> && data['data'] is Map<String, dynamic>) {
        payload = data['data'] as Map<String, dynamic>;
      } else if (data is Map<String, dynamic>) {
        payload = data;
      }

      final result = ChildTimetableData.fromJson(payload);
      await HiveService.cacheBox.put(cacheKey, jsonEncode(payload));
      return result;
    } catch (e) {
      final cached = HiveService.cacheBox.get(cacheKey);
      if (cached != null) {
        try {
          return ChildTimetableData.fromJson(jsonDecode(cached) as Map<String, dynamic>);
        } catch (_) {}
      }
      throw ApiException.fromDioError(e);
    }
  }
}

