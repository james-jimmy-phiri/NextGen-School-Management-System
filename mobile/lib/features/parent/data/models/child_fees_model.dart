class InvoiceLineItem {
  final String description;
  final double amount;

  const InvoiceLineItem({
    required this.description,
    required this.amount,
  });

  factory InvoiceLineItem.fromJson(Map<String, dynamic> json) {
    return InvoiceLineItem(
      description: json['description'] as String? ?? 'Item',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

class InvoiceItem {
  final int id;
  final String invoiceNumber;
  final String term;
  final double total;
  final double amountPaid;
  final double balanceDue;
  final String status;
  final String dueDate;
  final List<InvoiceLineItem> lines;

  const InvoiceItem({
    required this.id,
    required this.invoiceNumber,
    required this.term,
    required this.total,
    required this.amountPaid,
    required this.balanceDue,
    required this.status,
    required this.dueDate,
    required this.lines,
  });

  factory InvoiceItem.fromJson(Map<String, dynamic> json) {
    final rawLines = json['lines'] as List<dynamic>? ?? [];

    return InvoiceItem(
      id: json['id'] as int? ?? 0,
      invoiceNumber: json['invoice_number'] as String? ?? 'INV-000',
      term: json['term'] as String? ?? 'Term II',
      total: (json['total'] as num?)?.toDouble() ?? 0.0,
      amountPaid: (json['amount_paid'] as num?)?.toDouble() ?? 0.0,
      balanceDue: (json['balance_due'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] as String? ?? 'issued',
      dueDate: json['due_date'] as String? ?? '',
      lines: rawLines
          .map((l) => InvoiceLineItem.fromJson(l as Map<String, dynamic>))
          .toList(),
    );
  }
}

class PaymentReceiptItem {
  final int id;
  final String receiptNumber;
  final double amount;
  final String method;
  final String paidAt;
  final String reference;

  const PaymentReceiptItem({
    required this.id,
    required this.receiptNumber,
    required this.amount,
    required this.method,
    required this.paidAt,
    required this.reference,
  });

  factory PaymentReceiptItem.fromJson(Map<String, dynamic> json) {
    return PaymentReceiptItem(
      id: json['id'] as int? ?? 0,
      receiptNumber: json['receipt_number'] as String? ??
          json['reference'] as String? ??
          'RCP-000',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      method: json['method'] as String? ?? 'Cash',
      paidAt: json['paid_at'] as String? ?? '',
      reference: json['reference'] as String? ?? '',
    );
  }
}

class ChildFeesData {
  final double totalFees;
  final double amountPaid;
  final double balanceDue;
  final String currency;
  final List<InvoiceItem> invoices;
  final List<PaymentReceiptItem> payments;

  const ChildFeesData({
    required this.totalFees,
    required this.amountPaid,
    required this.balanceDue,
    required this.currency,
    required this.invoices,
    required this.payments,
  });

  factory ChildFeesData.fromJson(Map<String, dynamic> json) {
    final summary = json['summary'] as Map<String, dynamic>? ?? {};
    final rawInvoices = json['invoices'] as List<dynamic>? ?? [];
    final rawPayments = json['payments'] as List<dynamic>? ?? [];

    return ChildFeesData(
      totalFees: (summary['total_fees'] as num?)?.toDouble() ?? 0.0,
      amountPaid: (summary['amount_paid'] as num?)?.toDouble() ?? 0.0,
      balanceDue: (summary['balance_due'] as num?)?.toDouble() ?? 0.0,
      currency: summary['currency'] as String? ?? 'MWK',
      invoices: rawInvoices
          .map((i) => InvoiceItem.fromJson(i as Map<String, dynamic>))
          .toList(),
      payments: rawPayments
          .map((p) => PaymentReceiptItem.fromJson(p as Map<String, dynamic>))
          .toList(),
    );
  }
}

