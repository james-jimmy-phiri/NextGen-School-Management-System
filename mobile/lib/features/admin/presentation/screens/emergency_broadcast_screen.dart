import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../data/admin_repository.dart';
import '../../state/admin_state.dart';

class EmergencyBroadcastScreen extends ConsumerStatefulWidget {
  const EmergencyBroadcastScreen({super.key});

  @override
  ConsumerState<EmergencyBroadcastScreen> createState() => _EmergencyBroadcastScreenState();
}

class _EmergencyBroadcastScreenState extends ConsumerState<EmergencyBroadcastScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _messageController = TextEditingController();

  String _selectedAudience = 'all_guardians';
  bool _sendPush = true;
  bool _sendSms = true;
  bool _authorizedConsent = false;
  bool _isDispatching = false;

  final List<Map<String, String>> _audiences = [
    {'value': 'all_guardians', 'label': 'All Enrolled Households (School-wide)'},
    {'value': 'form_1', 'label': 'Form 1 Households Only'},
    {'value': 'form_2', 'label': 'Form 2 Households Only'},
    {'value': 'form_3', 'label': 'Form 3 Households Only'},
    {'value': 'form_4', 'label': 'Form 4 Households Only'},
    {'value': 'staff', 'label': 'Teaching & Support Staff Only'},
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _dispatchBroadcast() async {
    if (!_formKey.currentState!.validate()) return;

    if (!_sendPush && !_sendSms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select at least one delivery channel (Push or SMS).')),
      );
      return;
    }

    if (!_authorizedConsent) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please confirm leadership authorization before dispatching.')),
      );
      return;
    }

    setState(() => _isDispatching = true);

    try {
      final repo = ref.read(adminRepositoryProvider);
      final channels = <String>[];
      if (_sendPush) channels.add('push_notification');
      if (_sendSms) channels.add('sms_gateway');

      final result = await repo.sendEmergencyBroadcast(
        title: _titleController.text.trim(),
        message: _messageController.text.trim(),
        targetAudience: _selectedAudience,
        channels: channels,
      );

      ref.invalidate(adminTelemetryProvider);

      if (!mounted) return;

      _showBroadcastReceiptDialog(result);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Broadcast dispatch failed: $e'),
          backgroundColor: AppTheme.danger,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isDispatching = false);
      }
    }
  }

  void _showBroadcastReceiptDialog(Map<String, dynamic> result) {
    final count = result['recipients_reached'] ?? 0;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.check_circle, color: AppTheme.success, size: 28),
            SizedBox(width: 10),
            Text('Broadcast Dispatched'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Your emergency alert has been queued and dispatched across the mobile gateway.',
              style: const TextStyle(fontSize: 13, color: AppTheme.textMutedLight),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Total Recipients:', style: TextStyle(fontSize: 12, color: Colors.grey)),
                      Text('$count Guardians/Staff', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Channels:', style: TextStyle(fontSize: 12, color: Colors.grey)),
                      Text('${_sendPush ? "Push " : ""}${_sendSms ? "SMS" : ""}',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary, foregroundColor: Colors.white),
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pop(context);
            },
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Emergency Broadcast'),
        backgroundColor: const Color(0xFFDC2626),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ─── Warning Banner ───────────────────────────────────────────
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFFECACA)),
                ),
                child: const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.warning_amber_rounded, color: Color(0xFFDC2626), size: 26),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'High-Priority Alert Engine',
                            style: TextStyle(
                              fontWeight: FontWeight.w700,
                              fontSize: 14,
                              color: Color(0xFF991B1B),
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Emergency announcements bypass non-essential filters and send immediate SMS and push notifications to student guardians.',
                            style: TextStyle(fontSize: 12, color: Color(0xFFB91C1C), height: 1.3),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // ─── Target Audience ──────────────────────────────────────────
              const Text(
                'Target Audience',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),

              DropdownButtonFormField<String>(
                initialValue: _selectedAudience,
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.people_alt_outlined),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                items: _audiences
                    .map((a) => DropdownMenuItem(value: a['value'], child: Text(a['label']!)))
                    .toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedAudience = val);
                },
              ),
              const SizedBox(height: 20),

              // ─── Delivery Channels ────────────────────────────────────────
              const Text(
                'Delivery Channels',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),

              Row(
                children: [
                  Expanded(
                    child: CheckboxListTile(
                      title: const Text('Mobile App Push', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                      value: _sendPush,
                      dense: true,
                      controlAffinity: ListTileControlAffinity.leading,
                      contentPadding: EdgeInsets.zero,
                      onChanged: (val) => setState(() => _sendPush = val ?? false),
                    ),
                  ),
                  Expanded(
                    child: CheckboxListTile(
                      title: const Text('SMS Gateway', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                      value: _sendSms,
                      dense: true,
                      controlAffinity: ListTileControlAffinity.leading,
                      contentPadding: EdgeInsets.zero,
                      onChanged: (val) => setState(() => _sendSms = val ?? false),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // ─── Alert Headline ───────────────────────────────────────────
              const Text(
                'Alert Headline',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),

              TextFormField(
                controller: _titleController,
                decoration: InputDecoration(
                  hintText: 'e.g. Early School Closure: Severe Weather Warning',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Headline is required';
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // ─── Message Body ─────────────────────────────────────────────
              const Text(
                'Broadcast Details',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),

              TextFormField(
                controller: _messageController,
                maxLines: 5,
                decoration: InputDecoration(
                  hintText: 'Provide comprehensive instructions for guardians, transport drivers, and learners...',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Message body is required';
                  if (val.trim().length < 15) return 'Message must be at least 15 characters';
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // ─── Consent Authorization ────────────────────────────────────
              Container(
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: CheckboxListTile(
                  title: const Text(
                    'I confirm this emergency broadcast is authorized by Headteacher / School Leadership.',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                  value: _authorizedConsent,
                  controlAffinity: ListTileControlAffinity.leading,
                  onChanged: (val) => setState(() => _authorizedConsent = val ?? false),
                ),
              ),
              const SizedBox(height: 28),

              // ─── Dispatch Button ──────────────────────────────────────────
              AppButton(
                text: _isDispatching ? 'Transmitting Alert...' : 'Broadcast Emergency Alert Now',
                icon: Icons.cell_tower,
                color: const Color(0xFFDC2626),
                isLoading: _isDispatching,
                onPressed: _isDispatching ? () {} : _dispatchBroadcast,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
