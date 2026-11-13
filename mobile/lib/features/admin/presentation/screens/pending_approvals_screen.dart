import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../data/admin_repository.dart';
import '../../data/models/admin_telemetry_model.dart';
import '../../state/admin_state.dart';

class PendingApprovalsScreen extends ConsumerStatefulWidget {
  const PendingApprovalsScreen({super.key});

  @override
  ConsumerState<PendingApprovalsScreen> createState() => _PendingApprovalsScreenState();
}

class _PendingApprovalsScreenState extends ConsumerState<PendingApprovalsScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _handleDecision({
    required PendingApprovalModel approval,
    required String action,
  }) async {
    final commentController = TextEditingController();

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(action == 'approve' ? 'Confirm Approval' : 'Decline Request'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Are you sure you want to ${action == 'approve' ? 'approve' : 'decline'} this ${approval.category.toLowerCase()} for ${approval.requesterName}?'),
            const SizedBox(height: 14),
            TextField(
              controller: commentController,
              decoration: const InputDecoration(
                labelText: 'Administrative Remarks (Optional)',
                hintText: 'e.g. Approved per Term 1 guidelines',
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: action == 'approve' ? AppTheme.success : AppTheme.danger,
              foregroundColor: Colors.white,
            ),
            onPressed: () => Navigator.pop(ctx, true),
            child: Text(action == 'approve' ? 'Approve' : 'Decline'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    try {
      final repo = ref.read(adminRepositoryProvider);
      await repo.handleApproval(
        type: approval.type,
        id: approval.id,
        action: action,
        comments: commentController.text.trim(),
      );

      ref.invalidate(pendingApprovalsProvider);
      ref.invalidate(adminTelemetryProvider);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${approval.category} ${action == 'approve' ? 'approved' : 'declined'} successfully.'),
          backgroundColor: action == 'approve' ? AppTheme.success : AppTheme.warning,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Action failed: $e'),
          backgroundColor: AppTheme.danger,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final approvalsAsync = ref.watch(pendingApprovalsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pending Approvals'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppTheme.primary,
          unselectedLabelColor: AppTheme.textMutedLight,
          indicatorColor: AppTheme.primary,
          tabs: const [
            Tab(text: 'All Requests'),
            Tab(text: 'Staff Leave'),
            Tab(text: 'Transfers'),
          ],
        ),
      ),
      body: approvalsAsync.when(
        data: (approvals) {
          final leaves = approvals.where((a) => a.type == 'leave_request').toList();
          final transfers = approvals.where((a) => a.type == 'transfer').toList();

          return TabBarView(
            controller: _tabController,
            children: [
              _buildApprovalList(approvals),
              _buildApprovalList(leaves),
              _buildApprovalList(transfers),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 48, color: AppTheme.danger),
                const SizedBox(height: 12),
                Text('Could not load approvals: $err', textAlign: TextAlign.center),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.refresh(pendingApprovalsProvider),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildApprovalList(List<PendingApprovalModel> items) {
    if (items.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.task_alt, size: 54, color: AppTheme.success),
              SizedBox(height: 14),
              Text(
                'No Pending Approvals',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 6),
              Text(
                'All staff leave and student transfer requests have been cleared.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: AppTheme.textMutedLight),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        final isLeave = item.type == 'leave_request';

        return Card(
          margin: const EdgeInsets.only(bottom: 14),
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.grey.shade200),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: isLeave
                            ? const Color(0xFFEEF2FF)
                            : const Color(0xFFFEF3C7),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        item.category,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: isLeave
                              ? const Color(0xFF4338CA)
                              : const Color(0xFFB45309),
                        ),
                      ),
                    ),
                    Text(
                      _formatDate(item.submittedAt),
                      style: const TextStyle(fontSize: 11, color: AppTheme.textMutedLight),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  item.title,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.person_outline, size: 16, color: AppTheme.textMutedLight),
                    const SizedBox(width: 4),
                    Text(
                      '${item.requesterName} (${item.requesterRole})',
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textMainLight),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Text(
                    item.details,
                    style: const TextStyle(fontSize: 13, color: AppTheme.textMainLight, height: 1.3),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        icon: const Icon(Icons.close, size: 16, color: AppTheme.danger),
                        label: const Text('Decline', style: TextStyle(color: AppTheme.danger)),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.danger),
                          padding: const EdgeInsets.symmetric(vertical: 10),
                        ),
                        onPressed: () => _handleDecision(approval: item, action: 'reject'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.check, size: 16),
                        label: const Text('Approve'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.success,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 10),
                        ),
                        onPressed: () => _handleDecision(approval: item, action: 'approve'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  String _formatDate(String raw) {
    if (raw.isEmpty) return 'Today';
    try {
      final dt = DateTime.parse(raw);
      return '${dt.day}/${dt.month}/${dt.year}';
    } catch (_) {
      return raw;
    }
  }
}

