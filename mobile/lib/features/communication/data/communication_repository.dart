import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/storage/hive_service.dart';
import 'models/announcement_model.dart';
import 'models/calendar_event_model.dart';
import 'models/portal_message_model.dart';

final communicationRepositoryProvider = Provider<CommunicationRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return CommunicationRepository(dio);
});

class CommunicationRepository {
  final Dio _dio;

  CommunicationRepository(this._dio);

  static const String _announcementsCacheKey = 'ngms_announcements_cache';
  static const String _eventsCacheKey = 'ngms_calendar_events_cache';
  static const String _messagesCacheKey = 'ngms_messages_cache';

  /// Fetches school announcements with offline cache fallback
  Future<List<AnnouncementModel>> getAnnouncements() async {
    try {
      final response = await _dio.get(ApiEndpoints.announcements);
      final data = response.data;

      List<dynamic> list = [];
      if (data is Map<String, dynamic> && data['data'] is List) {
        list = data['data'] as List<dynamic>;
      } else if (data is List) {
        list = data;
      }

      final items = list
          .map((item) => AnnouncementModel.fromJson(item as Map<String, dynamic>))
          .toList();

      await HiveService.cacheBox.put(_announcementsCacheKey, jsonEncode(list));
      return items;
    } catch (e) {
      final cached = HiveService.cacheBox.get(_announcementsCacheKey);
      if (cached != null) {
        try {
          final list = jsonDecode(cached) as List<dynamic>;
          return list
              .map((item) => AnnouncementModel.fromJson(item as Map<String, dynamic>))
              .toList();
        } catch (_) {}
      }
      throw ApiException.fromDioError(e);
    }
  }

  /// Fetches school calendar events with offline cache fallback
  Future<List<CalendarEventModel>> getEvents() async {
    try {
      final response = await _dio.get(ApiEndpoints.calendarEvents);
      final data = response.data;

      List<dynamic> list = [];
      if (data is Map<String, dynamic> && data['data'] is List) {
        list = data['data'] as List<dynamic>;
      } else if (data is List) {
        list = data;
      }

      final items = list
          .map((item) => CalendarEventModel.fromJson(item as Map<String, dynamic>))
          .toList();

      await HiveService.cacheBox.put(_eventsCacheKey, jsonEncode(list));
      return items;
    } catch (e) {
      final cached = HiveService.cacheBox.get(_eventsCacheKey);
      if (cached != null) {
        try {
          final list = jsonDecode(cached) as List<dynamic>;
          return list
              .map((item) => CalendarEventModel.fromJson(item as Map<String, dynamic>))
              .toList();
        } catch (_) {}
      }
      throw ApiException.fromDioError(e);
    }
  }

  /// Fetches messages & threads for the user
  Future<List<PortalMessageModel>> getMessages() async {
    try {
      final response = await _dio.get(ApiEndpoints.messages);
      final data = response.data;

      List<dynamic> list = [];
      if (data is Map<String, dynamic> && data['data'] is List) {
        list = data['data'] as List<dynamic>;
      } else if (data is List) {
        list = data;
      }

      final items = list
          .map((item) => PortalMessageModel.fromJson(item as Map<String, dynamic>))
          .toList();

      await HiveService.cacheBox.put(_messagesCacheKey, jsonEncode(list));
      return items;
    } catch (e) {
      final cached = HiveService.cacheBox.get(_messagesCacheKey);
      if (cached != null) {
        try {
          final list = jsonDecode(cached) as List<dynamic>;
          return list
              .map((item) => PortalMessageModel.fromJson(item as Map<String, dynamic>))
              .toList();
        } catch (_) {}
      }
      throw ApiException.fromDioError(e);
    }
  }

  /// Send a 1-on-1 portal message
  Future<PortalMessageModel> sendMessage({
    required int toUserId,
    required String subject,
    required String body,
    int? studentId,
  }) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.sendMessage,
        data: {
          'to_user_id': toUserId,
          'subject': subject,
          'body': body,
          if (studentId != null) 'student_id': studentId,
        },
      );

      final data = response.data;
      Map<String, dynamic> payload = {};
      if (data is Map<String, dynamic> && data['data'] is Map<String, dynamic>) {
        payload = data['data'] as Map<String, dynamic>;
      } else if (data is Map<String, dynamic>) {
        payload = data;
      }

      return PortalMessageModel.fromJson(payload);
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  /// Get contacts list
  Future<List<ContactModel>> getContacts() async {
    try {
      final response = await _dio.get(ApiEndpoints.contacts);
      final data = response.data;

      List<dynamic> list = [];
      if (data is Map<String, dynamic> && data['data'] is List) {
        list = data['data'] as List<dynamic>;
      } else if (data is List) {
        list = data;
      }

      return list
          .map((item) => ContactModel.fromJson(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw ApiException.fromDioError(e);
    }
  }

  /// Mark message as read
  Future<void> markAsRead(int messageId) async {
    try {
      await _dio.patch(ApiEndpoints.markMessageRead(messageId));
    } catch (_) {}
  }
}

