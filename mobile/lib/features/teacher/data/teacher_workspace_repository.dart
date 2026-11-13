import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/storage/hive_service.dart';
import 'models/teacher_models.dart';

final teacherWorkspaceRepositoryProvider = Provider<TeacherWorkspaceRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return TeacherWorkspaceRepository(dio);
});

class TeacherWorkspaceRepository {
  final Dio _dio;

  TeacherWorkspaceRepository(this._dio);

  static const String _classesCacheKey = 'ngms_teacher_classes';

  /// Get classes assigned to this teacher
  Future<List<TeacherClassModel>> getClasses() async {
    try {
      final response = await _dio.get(ApiEndpoints.teacherClasses);
      final data = response.data;

      List<dynamic> list = [];
      if (data is Map<String, dynamic> && data['data'] is List) {
        list = data['data'] as List<dynamic>;
      } else if (data is List) {
        list = data;
      }

      final classes = list
          .map((c) => TeacherClassModel.fromJson(c as Map<String, dynamic>))
          .toList();

      await HiveService.cacheBox.put(_classesCacheKey, jsonEncode(list));
      return classes;
    } catch (e) {
      final cached = HiveService.cacheBox.get(_classesCacheKey);
      if (cached != null) {
        try {
          final list = jsonDecode(cached) as List<dynamic>;
          return list
              .map((c) => TeacherClassModel.fromJson(c as Map<String, dynamic>))
              .toList();
        } catch (_) {}
      }
      throw ApiException.fromDioError(e);
    }
  }

  /// Get student roster for a class and date
  Future<List<RosterStudentModel>> getClassStudents(
    int classGroupId, {
    String? date,
    int? streamId,
  }) async {
    final cacheKey = 'roster_${classGroupId}_$streamId';
    try {
      final response = await _dio.get(
        ApiEndpoints.teacherClassStudents(classGroupId),
        queryParameters: {
          if (date != null) 'date': date,
          if (streamId != null) 'stream_id': streamId,
        },
      );

      final data = response.data;
      List<dynamic> list = [];
      if (data is Map<String, dynamic> && data['data'] is Map<String, dynamic>) {
        list = data['data']['students'] as List<dynamic>? ?? [];
      } else if (data is Map<String, dynamic> && data['data'] is List) {
        list = data['data'] as List<dynamic>;
      }

      final students = list
          .map((s) => RosterStudentModel.fromJson(s as Map<String, dynamic>))
          .toList();

      await HiveService.cacheBox.put(cacheKey, jsonEncode(list));
      return students;
    } catch (e) {
      final cached = HiveService.cacheBox.get(cacheKey);
      if (cached != null) {
        try {
          final list = jsonDecode(cached) as List<dynamic>;
          return list
              .map((s) => RosterStudentModel.fromJson(s as Map<String, dynamic>))
              .toList();
        } catch (_) {}
      }
      throw ApiException.fromDioError(e);
    }
  }

  /// Save attendance register locally in Hive (offline-first)
  Future<void> saveAttendanceLocally({
    required int classGroupId,
    required String date,
    required String sessionType,
    required List<RosterStudentModel> students,
  }) async {
    final box = HiveService.cacheBox;
    final queueKey = 'offline_session_${classGroupId}_${date}_$sessionType';

    final payload = {
      'class_group_id': classGroupId,
      'date': date,
      'session_type': sessionType,
      'records': students.map((s) => s.toJson()).toList(),
      'timestamp': DateTime.now().toIso8601String(),
    };

    await box.put(queueKey, jsonEncode(payload));
  }

  /// Get count of pending offline attendance sessions awaiting sync
  int getPendingSyncCount() {
    final box = HiveService.cacheBox;
    final pendingKeys = box.keys
        .where((k) => k.toString().startsWith('offline_session_'))
        .toList();
    return pendingKeys.length;
  }

  /// Synchronize all pending offline attendance sessions with the backend API
  Future<({int synced, int failed})> syncPendingAttendance() async {
    final box = HiveService.cacheBox;
    final pendingKeys = box.keys
        .where((k) => k.toString().startsWith('offline_session_'))
        .toList();

    int synced = 0;
    int failed = 0;

    for (final key in pendingKeys) {
      final raw = box.get(key);
      if (raw == null) continue;

      try {
        final payload = jsonDecode(raw) as Map<String, dynamic>;
        final response = await _dio.post(
          ApiEndpoints.teacherAttendanceSync,
          data: payload,
        );

        if (response.statusCode == 200 || response.statusCode == 201) {
          await box.delete(key);
          synced++;
        } else {
          failed++;
        }
      } catch (_) {
        failed++;
      }
    }

    return (synced: synced, failed: failed);
  }

  /// Direct online sync for an immediate roll-call submission
  Future<void> submitAttendanceDirectly({
    required int classGroupId,
    required String date,
    required String sessionType,
    required List<RosterStudentModel> students,
  }) async {
    try {
      await _dio.post(
        ApiEndpoints.teacherAttendanceSync,
        data: {
          'class_group_id': classGroupId,
          'date': date,
          'session_type': sessionType,
          'records': students.map((s) => s.toJson()).toList(),
        },
      );
    } catch (e) {
      // If direct network fails, fallback to local offline queue!
      await saveAttendanceLocally(
        classGroupId: classGroupId,
        date: date,
        sessionType: sessionType,
        students: students,
      );
      rethrow;
    }
  }

  /// Get teacher continuous assessments
  Future<List<TeacherAssessmentModel>> getAssessments() async {
    try {
      final response = await _dio.get(ApiEndpoints.teacherAssessments);
      final data = response.data;

      List<dynamic> list = [];
      if (data is Map<String, dynamic> && data['data'] is List) {
        list = data['data'] as List<dynamic>;
      } else if (data is List) {
        list = data;
      }

      return list
          .map((a) => TeacherAssessmentModel.fromJson(a as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  /// Submit assessment marks
  Future<void> saveMarks(int assessmentId, List<Map<String, dynamic>> marks) async {
    try {
      await _dio.post(
        ApiEndpoints.teacherSaveMarks(assessmentId),
        data: {'marks': marks},
      );
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  /// Get teacher timetable schedule
  Future<List<Map<String, dynamic>>> getTimetable() async {
    try {
      final response = await _dio.get(ApiEndpoints.teacherTimetable);
      final data = response.data;

      List<dynamic> list = [];
      if (data is Map<String, dynamic> && data['data'] is List) {
        list = data['data'] as List<dynamic>;
      } else if (data is List) {
        list = data;
      }

      return list.map((item) => Map<String, dynamic>.from(item as Map)).toList();
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }
}

