import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../data/models/payment_intent_model.dart';
import '../../state/finance_state.dart';

class DigitalReceiptScreen extends ConsumerWidget {
  final String reference;

  const DigitalReceiptScreen({
    super.key,
    required this.reference,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final receiptAsync = ref.watch(receiptProvider(reference));

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        title: const Text('Payment Voucher'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined),
            tooltip: 'Share Receipt',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Receipt $reference ready for sharing!'),
                  backgroundColor: AppTheme.success,
                ),
              );
            },
          ),
        ],
      ),
      body: receiptAsync.when(
        data: (receipt) => _ReceiptVoucherBody(receipt: receipt),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 48, color: AppTheme.danger),
                const SizedBox(height: 12),
                Text('Could not load receipt: $err', textAlign: TextAlign.center),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.refresh(receiptProvider(reference)),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ReceiptVoucherBody extends StatelessWidget {
  final DigitalReceiptModel receipt;

  const _ReceiptVoucherBody({required this.receipt});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          // ─── Printable Voucher Container ─────────────────────────────────
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.06),
                  blurRadius: 18,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // School Header
                CircleAvatar(
                  radius: 26,
                  backgroundColor: AppTheme.primary.withValues(alpha: 0.1),
                  child: const Icon(Icons.school, color: AppTheme.primary, size: 28),
                ),
                const SizedBox(height: 10),
                Text(
                  receipt.schoolName,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.textMainLight),
                ),
                Text(
                  '${receipt.schoolPhone} • ${receipt.schoolEmail}',
                  style: const TextStyle(fontSize: 11, color: AppTheme.textMutedLight),
                ),
                const SizedBox(height: 14),

                // Verified Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDCFCE7),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFF86EFAC)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.verified, color: Color(0xFF16A34A), size: 16),
                      SizedBox(width: 6),
                      Text(
                        'OFFICIAL PAYMENT RECEIPT',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF16A34A),
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Total Amount Paid
                Text(
                  '${receipt.currency} ${receipt.amount.toStringAsFixed(0)}',
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    color: AppTheme.primary,
                    letterSpacing: -0.5,
                  ),
                ),
                const Text(
                  'Settled & Cleared',
                  style: TextStyle(fontSize: 12, color: AppTheme.textMutedLight, fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 24),

                // Jagged / Dashed Divider
                Row(
                  children: List.generate(
                    30,
                    (index) => Expanded(
                      child: Container(
                        height: 1,
                        color: index.isEven ? Colors.grey.shade300 : Colors.transparent,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Key Value Ledger
                _ReceiptRow(label: 'Receipt Number', value: receipt.receiptNumber, isBold: true),
                _ReceiptRow(label: 'Transaction Ref', value: receipt.reference),
                _ReceiptRow(label: 'Payment Method', value: receipt.providerName),
                _ReceiptRow(label: 'Student Name', value: receipt.studentName, isBold: true),
                _ReceiptRow(label: 'Admission ID', value: receipt.admissionNumber),
                _ReceiptRow(label: 'Invoice Linked', value: receipt.invoiceNumber),
                _ReceiptRow(label: 'Payer', value: receipt.payerName),
                if (receipt.phoneNumber != null)
                  _ReceiptRow(label: 'Phone Number', value: receipt.phoneNumber!),
                _ReceiptRow(label: 'Date & Time', value: _formatDateTime(receipt.paidAt)),

                const SizedBox(height: 20),

                // Simulated Digital QR Code Verification Seal
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: const Icon(Icons.qr_code_2, size: 44, color: AppTheme.textMainLight),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Verified NextGen Cryptographic Seal',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(height: 3),
                            Text(
                              'Tamper-proof receipt recorded on Sunrise Academy Ledger.',
                              style: TextStyle(fontSize: 10, color: AppTheme.textMutedLight),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // ─── Actions Bottom Bar ───────────────────────────────────────────
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.download_outlined),
                  label: const Text('Save PDF'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Voucher ${receipt.receiptNumber} saved to Downloads!'),
                        backgroundColor: AppTheme.success,
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AppButton(
                  text: 'Back to Home',
                  icon: Icons.done,
                  onPressed: () => Navigator.pop(context),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _formatDateTime(String raw) {
    if (raw.isEmpty) return 'Recent';
    try {
      final dt = DateTime.parse(raw);
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return raw;
    }
  }
}

class _ReceiptRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isBold;

  const _ReceiptRow({
    required this.label,
    required this.value,
    this.isBold = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: AppTheme.textMutedLight),
          ),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: TextStyle(
                fontSize: 13,
                fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
                color: AppTheme.textMainLight,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

