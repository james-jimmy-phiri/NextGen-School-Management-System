import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../parent/state/parent_portal_state.dart';
import '../../data/models/payment_intent_model.dart';
import '../../state/finance_state.dart';
import 'digital_receipt_screen.dart';

class MobileMoneyPaymentScreen extends ConsumerStatefulWidget {
  final int invoiceId;
  final String invoiceNumber;
  final String studentName;
  final double totalAmountDue;
  final String currency;

  const MobileMoneyPaymentScreen({
    super.key,
    required this.invoiceId,
    required this.invoiceNumber,
    required this.studentName,
    required this.totalAmountDue,
    this.currency = 'MWK',
  });

  @override
  ConsumerState<MobileMoneyPaymentScreen> createState() => _MobileMoneyPaymentScreenState();
}

class _MobileMoneyPaymentScreenState extends ConsumerState<MobileMoneyPaymentScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _amountController;
  final TextEditingController _phoneController = TextEditingController();

  MobilePaymentProvider _selectedProvider = MobilePaymentProvider.airtelMoney;
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    _amountController = TextEditingController(text: widget.totalAmountDue.toStringAsFixed(0));
  }

  @override
  void dispose() {
    _amountController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _onProviderChanged(MobilePaymentProvider provider) {
    setState(() {
      _selectedProvider = provider;
      if (_phoneController.text.isEmpty) {
        _phoneController.text = provider == MobilePaymentProvider.airtelMoney ? '099' : '088';
      }
    });
  }

  Future<void> _processPayment() async {
    if (!_formKey.currentState!.validate()) return;

    final amount = double.tryParse(_amountController.text.trim());
    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid payment amount.')),
      );
      return;
    }

    setState(() => _isProcessing = true);

    final request = MobilePaymentRequest(
      invoiceId: widget.invoiceId,
      amount: amount,
      phoneNumber: _phoneController.text.trim(),
      provider: _selectedProvider.code,
      studentName: widget.studentName,
      invoiceNumber: widget.invoiceNumber,
    );

    try {
      final result = await ref.read(paymentProcessingProvider.notifier).submitPayment(request);

      // Invalidate parent fees cache so statement updates instantly
      ref.invalidate(childFeesProvider);
      ref.invalidate(paymentHistoryProvider);

      if (!mounted) return;

      _showSuccessDialog(result);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Payment initiation failed: ${e.toString().replaceAll("Exception:", "")}'),
          backgroundColor: AppTheme.danger,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isProcessing = false);
      }
    }
  }

  void _showSuccessDialog(MobilePaymentResult result) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        contentPadding: const EdgeInsets.all(24),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: Color(0xFFDCFCE7),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 54),
            ),
            const SizedBox(height: 18),
            const Text(
              'Payment Received!',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              '${widget.currency} ${result.amount.toStringAsFixed(0)} successfully settled for ${result.studentName}.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 13, color: AppTheme.textMutedLight),
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Reference:', style: TextStyle(fontSize: 12, color: Colors.grey)),
                      Text(result.reference, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Receipt No:', style: TextStyle(fontSize: 12, color: Colors.grey)),
                      Text(result.receiptNumber, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.pop(ctx); // Close dialog
                      Navigator.pop(context); // Close payment screen
                    },
                    child: const Text('Close'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () {
                      Navigator.pop(ctx);
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (_) => DigitalReceiptScreen(reference: result.reference),
                        ),
                      );
                    },
                    child: const Text('View Receipt'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final brandColor = Color(_selectedProvider.brandColorValue);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mobile Money Checkout'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ─── Target Student & Invoice Card ──────────────────────────────
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.primary.withValues(alpha: 0.15)),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: AppTheme.primary,
                      child: Text(
                        widget.studentName.isNotEmpty ? widget.studentName[0] : 'S',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.studentName,
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            'Invoice: ${widget.invoiceNumber}',
                            style: const TextStyle(fontSize: 12, color: AppTheme.textMutedLight),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text('Due', style: TextStyle(fontSize: 11, color: AppTheme.textMutedLight)),
                        Text(
                          '${widget.currency} ${widget.totalAmountDue.toStringAsFixed(0)}',
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppTheme.primary),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // ─── Select Mobile Carrier ──────────────────────────────────────
              const Text(
                'Select Mobile Money Provider',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 12),

              Row(
                children: [
                  Expanded(
                    child: _ProviderTile(
                      provider: MobilePaymentProvider.airtelMoney,
                      isSelected: _selectedProvider == MobilePaymentProvider.airtelMoney,
                      onTap: () => _onProviderChanged(MobilePaymentProvider.airtelMoney),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _ProviderTile(
                      provider: MobilePaymentProvider.tnmMpamba,
                      isSelected: _selectedProvider == MobilePaymentProvider.tnmMpamba,
                      onTap: () => _onProviderChanged(MobilePaymentProvider.tnmMpamba),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // ─── Payment Amount ─────────────────────────────────────────────
              const Text(
                'Payment Amount (MWK)',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),

              TextFormField(
                controller: _amountController,
                keyboardType: TextInputType.number,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.money),
                  prefixText: '${widget.currency} ',
                  hintText: 'Enter amount',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Enter amount';
                  final n = double.tryParse(val);
                  if (n == null || n < 100) return 'Minimum payment is MWK 100';
                  return null;
                },
              ),
              const SizedBox(height: 8),

              // Quick amount presets
              Wrap(
                spacing: 8,
                children: [
                  ActionChip(
                    label: Text('Full Due (${widget.totalAmountDue.toStringAsFixed(0)})'),
                    onPressed: () => _amountController.text = widget.totalAmountDue.toStringAsFixed(0),
                  ),
                  if (widget.totalAmountDue > 20000)
                    ActionChip(
                      label: Text('Half (${(widget.totalAmountDue / 2).toStringAsFixed(0)})'),
                      onPressed: () => _amountController.text = (widget.totalAmountDue / 2).toStringAsFixed(0),
                    ),
                ],
              ),
              const SizedBox(height: 20),

              // ─── Mobile Number Input ────────────────────────────────────────
              Text(
                '${_selectedProvider.label} Phone Number',
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),

              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.phone_iphone),
                  hintText: 'e.g. ${_selectedProvider.prefixHint}1234567',
                  helperText: 'A push prompt will be sent to this number to authorize the transaction.',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) return 'Enter mobile number';
                  final cleaned = val.trim().replaceAll(' ', '').replaceAll('-', '');
                  if (cleaned.length < 9) return 'Enter a valid Malawian phone number';
                  return null;
                },
              ),
              const SizedBox(height: 24),

              // ─── USSD Instruction Card ──────────────────────────────────────
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: brandColor.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: brandColor.withValues(alpha: 0.2)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.info_outline, color: brandColor, size: 20),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'After tapping Pay, unlock your device and confirm the prompt on your screen by entering your ${_selectedProvider.label} 4-digit PIN.',
                        style: TextStyle(fontSize: 12, color: brandColor),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // ─── Submit Payment Button ──────────────────────────────────────
              AppButton(
                text: _isProcessing ? 'Processing Transaction...' : 'Authorize Payment Now',
                icon: Icons.lock_outline,
                isLoading: _isProcessing,
                color: brandColor,
                onPressed: _isProcessing ? () {} : _processPayment,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProviderTile extends StatelessWidget {
  final MobilePaymentProvider provider;
  final bool isSelected;
  final VoidCallback onTap;

  const _ProviderTile({
    required this.provider,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final brandColor = Color(provider.brandColorValue);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
        decoration: BoxDecoration(
          color: isSelected ? brandColor.withValues(alpha: 0.08) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? brandColor : Colors.grey.shade300,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: brandColor,
              child: const Icon(Icons.phone_android, color: Colors.white, size: 18),
            ),
            const SizedBox(height: 8),
            Text(
              provider.label,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 13,
                color: isSelected ? brandColor : Colors.black87,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              '${provider.prefixHint}...',
              style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
            ),
          ],
        ),
      ),
    );
  }
}

