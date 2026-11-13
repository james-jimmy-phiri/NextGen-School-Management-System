import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/finance_repository.dart';
import '../data/models/payment_intent_model.dart';

final paymentHistoryProvider = FutureProvider<List<DigitalReceiptModel>>((ref) async {
  final repo = ref.watch(financeRepositoryProvider);
  return repo.getHistory();
});

final receiptProvider = FutureProvider.family<DigitalReceiptModel, String>((ref, reference) async {
  final repo = ref.watch(financeRepositoryProvider);
  return repo.getReceipt(reference);
});

class PaymentProcessingNotifier extends StateNotifier<AsyncValue<MobilePaymentResult?>> {
  final FinanceRepository _repo;

  PaymentProcessingNotifier(this._repo) : super(const AsyncValue.data(null));

  Future<MobilePaymentResult> submitPayment(MobilePaymentRequest request) async {
    state = const AsyncValue.loading();
    try {
      final result = await _repo.payMobileMoney(request);
      state = AsyncValue.data(result);
      return result;
    } catch (err, stack) {
      state = AsyncValue.error(err, stack);
      rethrow;
    }
  }

  void reset() {
    state = const AsyncValue.data(null);
  }
}

final paymentProcessingProvider =
    StateNotifierProvider<PaymentProcessingNotifier, AsyncValue<MobilePaymentResult?>>((ref) {
  return PaymentProcessingNotifier(ref.watch(financeRepositoryProvider));
});

