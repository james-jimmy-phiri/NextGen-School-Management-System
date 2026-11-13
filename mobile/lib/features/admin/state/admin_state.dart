import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/admin_repository.dart';
import '../data/models/admin_telemetry_model.dart';

final adminTelemetryProvider = FutureProvider<AdminTelemetryModel>((ref) async {
  final repo = ref.watch(adminRepositoryProvider);
  return repo.getTelemetry();
});

final pendingApprovalsProvider = FutureProvider<List<PendingApprovalModel>>((ref) async {
  final repo = ref.watch(adminRepositoryProvider);
  return repo.getApprovals();
});

