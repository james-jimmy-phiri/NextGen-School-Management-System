import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import 'models/payment_intent_model.dart';

final financeRepositoryProvider = Provider<FinanceRepository>((ref) {
  return FinanceRepository(ref.watch(apiClientProvider));
});

class FinanceRepository {
  final ApiClient _apiClient;

  FinanceRepository(this._apiClient);

  /// Process mobile money payment (Airtel Money / TNM Mpamba)
  Future<MobilePaymentResult> payMobileMoney(MobilePaymentRequest request) async {
    final response = await _apiClient.post(
      '/finance/pay-mobile-money',
      data: request.toJson(),
    );

    final resData = response.data;
    if (resData is Map<String, dynamic> && resData['success'] == true) {
      final payload = resData['data'] as Map<String, dynamic>? ?? resData;
      return MobilePaymentResult.fromJson(payload);
    }

    throw Exception(resData['message'] ?? 'Payment failed to process');
  }

  /// Retrieve official digital payment receipt
  Future<DigitalReceiptModel> getReceipt(String reference) async {
    final response = await _apiClient.get('/finance/receipt/$reference');
    final resData = response.data;
    if (resData is Map<String, dynamic> && resData['success'] == true) {
      final payload = resData['data'] as Map<String, dynamic>;
      return DigitalReceiptModel.fromJson(payload);
    }

    throw Exception(resData['message'] ?? 'Receipt could not be loaded');
  }

  /// Retrieve recent mobile payment transactions history
  Future<List<DigitalReceiptModel>> getHistory() async {
    final response = await _apiClient.get('/finance/history');
    final resData = response.data;
    if (resData is Map<String, dynamic> && resData['success'] == true) {
      final list = resData['data'] as List<dynamic>? ?? [];
      return list.map((item) => DigitalReceiptModel.fromJson(item as Map<String, dynamic>)).toList();
    }
    return [];
  }
}

