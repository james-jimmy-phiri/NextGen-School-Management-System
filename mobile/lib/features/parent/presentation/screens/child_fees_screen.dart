import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../finance/presentation/screens/digital_receipt_screen.dart';
import '../../../finance/presentation/screens/mobile_money_payment_screen.dart';
import '../../data/models/child_fees_model.dart';
import '../../data/models/child_model.dart';
import '../../state/parent_portal_state.dart';

class ChildFeesScreen extends ConsumerWidget {
  final ChildModel child;

  const ChildFeesScreen({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final feesAsync = ref.watch(childFeesProvider(child.id));

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${child.firstName}\'s Fee Statement',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            Text(
              '${child.className} · Financial Ledger',
              style: const TextStyle(fontSize: 11, color: AppTheme.textMutedLight),
            ),
          ],
        ),
      ),
      body: feesAsync.when(
        data: (feesData) => _buildContent(context, feesData),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 48, color: AppTheme.error),
                const SizedBox(height: 12),
                Text('Could not load fee statement: $err', textAlign: TextAlign.center),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.refresh(childFeesProvider(child.id)),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContent(BuildContext context, ChildFeesData data) {
    final isCleared = data.balanceDue <= 0;

    return ListView(
      padding: const EdgeInsets.all(18),
      children: [
        // ─── Balance Summary Card ──────────────────────────────────────────
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: isCleared ? const Color(0xFF0F766E) : const Color(0xFF1E293B),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.15),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'OUTSTANDING BALANCE',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: Color(0xCCFFFFFF),
                      letterSpacing: 0.6,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: isCleared
                          ? AppTheme.success.withValues(alpha: 0.3)
                          : AppTheme.error.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      isCleared ? 'All Cleared' : 'Balance Due',
                      style: TextStyle(
                        color: isCleared ? const Color(0xFF6EE7B7) : const Color(0xFFFCA5A5),
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                '${data.currency} ${data.balanceDue.toStringAsFixed(0)}',
                style: const TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 18),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _BalanceSub(label: 'Total Invoiced', value: '${data.currency} ${data.totalFees.toStringAsFixed(0)}'),
                    Container(height: 24, width: 1, color: Colors.white24),
                    _BalanceSub(label: 'Total Paid', value: '${data.currency} ${data.amountPaid.toStringAsFixed(0)}'),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // ─── Payment CTA ───────────────────────────────────────────────────
        if (!isCleared)
          AppButton(
            text: 'Pay via Airtel Money / TNM Mpamba',
            icon: Icons.payments_outlined,
            color: const Color(0xFF0F766E),
            onPressed: () {
              final dueInvoice = data.invoices.firstWhere(
                (inv) => inv.balanceDue > 0,
                orElse: () => data.invoices.isNotEmpty
                    ? data.invoices.first
                    : const InvoiceItem(
                        id: 1,
                        invoiceNumber: 'INV-NEW',
                        term: 'Current Term',
                        total: 0,
                        amountPaid: 0,
                        balanceDue: 0,
                        status: 'unpaid',
                        dueDate: '',
                        lines: [],
                      ),
              );

              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => MobileMoneyPaymentScreen(
                    invoiceId: dueInvoice.id,
                    invoiceNumber: dueInvoice.invoiceNumber,
                    studentName: child.name,
                    totalAmountDue: data.balanceDue > 0 ? data.balanceDue : dueInvoice.balanceDue,
                    currency: data.currency,
                  ),
                ),
              );
            },
          ),
        const SizedBox(height: 24),

        // ─── Invoices Section ──────────────────────────────────────────────
        const Text(
          'Invoices & Levies',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 10),

        if (data.invoices.isEmpty)
          const Text('No invoices issued yet.', style: TextStyle(color: AppTheme.textMutedLight))
        else
          ...data.invoices.map((inv) => _buildInvoiceCard(context, inv, data.currency)),

        const SizedBox(height: 24),

        // ─── Payment Receipts Section ──────────────────────────────────────
        const Text(
          'Payment Receipts History',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 10),

        if (data.payments.isEmpty)
          const Text('No payments recorded yet.', style: TextStyle(color: AppTheme.textMutedLight))
        else
          ...data.payments.map((p) => _buildPaymentCard(context, p, data.currency)),
      ],
    );
  }

  Widget _buildInvoiceCard(BuildContext context, InvoiceItem inv, String currency) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        leading: CircleAvatar(
          backgroundColor: AppTheme.primaryLight.withValues(alpha: 0.12),
          child: const Icon(Icons.receipt, color: AppTheme.primary, size: 20),
        ),
        title: Text(
          inv.invoiceNumber,
          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
        ),
        subtitle: Text(
          '${inv.term} · Due: ${inv.dueDate}',
          style: const TextStyle(fontSize: 12, color: AppTheme.textMutedLight),
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '$currency ${inv.total.toStringAsFixed(0)}',
              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
            ),
            Text(
              inv.status.toUpperCase(),
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: inv.status == 'paid' ? AppTheme.success : AppTheme.warning,
              ),
            ),
          ],
        ),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Divider(),
                const Text(
                  'Itemized Breakdown',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12),
                ),
                const SizedBox(height: 8),
                ...inv.lines.map(
                  (line) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(line.description, style: const TextStyle(fontSize: 13)),
                        Text(
                          '$currency ${line.amount.toStringAsFixed(0)}',
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                ),
                if (inv.balanceDue > 0) ...[
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.payment, size: 16),
                      label: Text('Pay Invoice Balance ($currency ${inv.balanceDue.toStringAsFixed(0)})'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        foregroundColor: Colors.white,
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => MobileMoneyPaymentScreen(
                              invoiceId: inv.id,
                              invoiceNumber: inv.invoiceNumber,
                              studentName: child.name,
                              totalAmountDue: inv.balanceDue,
                              currency: currency,
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentCard(BuildContext context, PaymentReceiptItem p, String currency) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => DigitalReceiptScreen(reference: p.reference),
            ),
          );
        },
        leading: CircleAvatar(
          backgroundColor: AppTheme.success.withValues(alpha: 0.12),
          child: const Icon(Icons.check_circle_outline, color: AppTheme.success, size: 20),
        ),
        title: Text(
          p.receiptNumber,
          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
        ),
        subtitle: Text(
          '${p.method} · ${p.reference}\nTap to view official voucher',
          style: const TextStyle(fontSize: 12, color: AppTheme.textMutedLight),
        ),
        trailing: Text(
          '+ $currency ${p.amount.toStringAsFixed(0)}',
          style: const TextStyle(
            color: AppTheme.success,
            fontWeight: FontWeight.w800,
            fontSize: 14,
          ),
        ),
      ),
    );
  }
}

class _BalanceSub extends StatelessWidget {
  final String label;
  final String value;

  const _BalanceSub({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 13),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(color: Color(0xAAFFFFFF), fontSize: 10),
        ),
      ],
    );
  }
}

