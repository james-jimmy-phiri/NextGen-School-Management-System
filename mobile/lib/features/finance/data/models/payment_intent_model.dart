enum MobilePaymentProvider {
  airtelMoney('airtel_money', 'Airtel Money', '099', 0xFFE11900),
  tnmMpamba('tnm_mpamba', 'TNM Mpamba', '088', 0xFF059669);

  final String code;
  final String label;
  final String prefixHint;
  final int brandColorValue;

  const MobilePaymentProvider(
    this.code,
    this.label,
    this.prefixHint,
    this.brandColorValue,
  );
}

class MobilePaymentRequest {
  final int invoiceId;
  final double amount;
  final String phoneNumber;
  final String provider;
  final String studentName;
  final String invoiceNumber;

  const MobilePaymentRequest({
    required this.invoiceId,
    required this.amount,
    required this.phoneNumber,
    required this.provider,
    required this.studentName,
    required this.invoiceNumber,
  });

  Map<String, dynamic> toJson() => {
    'invoice_id': invoiceId,
    'amount': amount,
    'phone_number': phoneNumber,
    'provider': provider,
  };
}

class MobilePaymentResult {
  final bool success;
  final String reference;
  final String receiptNumber;
  final double amount;
  final String currency;
  final String provider;
  final String phoneNumber;
  final String paidAt;
  final String studentName;
  final String invoiceNumber;
  final double remainingBalance;
  final String invoiceStatus;
  final String message;

  const MobilePaymentResult({
    required this.success,
    required this.reference,
    required this.receiptNumber,
    required this.amount,
    required this.currency,
    required this.provider,
    required this.phoneNumber,
    required this.paidAt,
    required this.studentName,
    required this.invoiceNumber,
    required this.remainingBalance,
    required this.invoiceStatus,
    required this.message,
  });

  factory MobilePaymentResult.fromJson(Map<String, dynamic> json) {
    return MobilePaymentResult(
      success: json['success'] as bool? ?? false,
      reference: json['reference'] as String? ?? '',
      receiptNumber: json['receipt_number'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? 'MWK',
      provider: json['provider'] as String? ?? '',
      phoneNumber: json['phone_number'] as String? ?? '',
      paidAt: json['paid_at'] as String? ?? '',
      studentName: json['student_name'] as String? ?? 'Student',
      invoiceNumber: json['invoice_number'] as String? ?? '',
      remainingBalance: (json['remaining_balance'] as num?)?.toDouble() ?? 0.0,
      invoiceStatus: json['invoice_status'] as String? ?? 'partial',
      message: json['message'] as String? ?? '',
    );
  }
}

class DigitalReceiptModel {
  final int id;
  final String reference;
  final String receiptNumber;
  final String invoiceNumber;
  final String studentName;
  final String admissionNumber;
  final double amount;
  final String currency;
  final String method;
  final String providerName;
  final String payerName;
  final String? phoneNumber;
  final String paidAt;
  final String schoolName;
  final String schoolPhone;
  final String schoolEmail;
  final bool verified;

  const DigitalReceiptModel({
    required this.id,
    required this.reference,
    required this.receiptNumber,
    required this.invoiceNumber,
    required this.studentName,
    required this.admissionNumber,
    required this.amount,
    required this.currency,
    required this.method,
    required this.providerName,
    required this.payerName,
    this.phoneNumber,
    required this.paidAt,
    required this.schoolName,
    required this.schoolPhone,
    required this.schoolEmail,
    required this.verified,
  });

  factory DigitalReceiptModel.fromJson(Map<String, dynamic> json) {
    return DigitalReceiptModel(
      id: json['id'] as int? ?? 0,
      reference: json['reference'] as String? ?? '',
      receiptNumber: json['receipt_number'] as String? ?? '',
      invoiceNumber: json['invoice_number'] as String? ?? '',
      studentName: json['student_name'] as String? ?? 'Student',
      admissionNumber: json['admission_number'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? 'MWK',
      method: json['method'] as String? ?? '',
      providerName: json['provider_name'] as String? ?? 'Mobile Money',
      payerName: json['payer_name'] as String? ?? 'Guardian',
      phoneNumber: json['phone_number'] as String?,
      paidAt: json['paid_at'] as String? ?? '',
      schoolName: json['school_name'] as String? ?? 'Sunrise Academy',
      schoolPhone: json['school_phone'] as String? ?? '+265 1 234 567',
      schoolEmail: json['school_email'] as String? ?? 'finance@school.mw',
      verified: json['verified'] as bool? ?? true,
    );
  }
}

