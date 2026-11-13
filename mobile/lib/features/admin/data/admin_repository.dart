import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import 'models/admin_telemetry_model.dart';

final adminRepositoryProvider = Provider<AdminRepository>((ref) {
  return AdminRepository(ref.watch(apiClientProvider));
});

class AdminRepository {
  final ApiClient _apiClient;

  AdminRepository(this._apiClient);

  /// Fetch live telemetry KPIs for executive cockpit
  Future<AdminTelemetryModel> getTelemetry() async {
    final response = await _apiClient.get('/admin/telemetry');
    final resData = response.data;
    if (resData is Map<String, dynamic> && resData['success'] == true) {
      final payload = resData['data'] as Map<String, dynamic>;
      return AdminTelemetryModel.fromJson(payload);
    }
    throw Exception(resData['message'] ?? 'Failed to load telemetry');
  }

  /// Fetch list of pending approvals (Staff Leave, Student Transfers)
  Future<List<PendingApprovalModel>> getApprovals() async {
    final response = await _apiClient.get('/admin/approvals');
    final resData = response.data;
    if (resData is Map<String, dynamic> && resData['success'] == true) {
      final list = resData['data'] as List<dynamic>? ?? [];
      return list.map((item) => PendingApprovalModel.fromJson(item as Map<String, dynamic>)).toList();
    }
    return [];
  }

  /// Approve or reject a pending request
  Future<void> handleApproval({
    required String type,
    required int id,
    required String action,
    String? comments,
  }) async {
    final response = await _apiClient.post(
      '/admin/approvals/$type/$id',
      data: {
        'action': action,
        if (comments != null && comments.isNotEmpty) 'comments': comments,
      },
    );

    final resData = response.data;
    if (resData is Map<String, dynamic> && resData['success'] == true) {
      return;
    }
    throw Exception(resData['message'] ?? 'Failed to process approval');
  }

  /// Dispatch an urgent Emergency Broadcast to all registered guardians
  Future<Map<String, dynamic>> sendEmergencyBroadcast({
    required String title,
    required String message,
    required String targetAudience,
    List<String>? channels,
  }) async {
    final response = await _apiClient.post(
      '/admin/emergency-broadcast',
      data: {
        'title': title,
        'message': message,
        'target_audience': targetAudience,
        'channels': channels ?? ['push_notification', 'sms_gateway'],
      },
    );

    final resData = response.data;
    if (resData is Map<String, dynamic> && resData['success'] == true) {
      return resData['data'] as Map<String, dynamic>? ?? {};
    }
    throw Exception(resData['message'] ?? 'Emergency broadcast failed to dispatch');
  }
}

