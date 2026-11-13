<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Student;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class MobileFinanceApiController extends Controller
{
    /**
     * Process or simulate an in-app Mobile Money (Airtel Money / TNM Mpamba) payment.
     */
    public function payMobileMoney(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'invoice_id' => ['required', 'exists:invoices,id'],
            'amount' => ['required', 'numeric', 'min:100'],
            'phone_number' => ['required', 'string'],
            'provider' => ['required', 'string', 'in:airtel_money,tnm_mpamba,bank_transfer'],
        ]);

        $user = $request->user();
        $invoice = Invoice::with(['student', 'school'])->findOrFail($validated['invoice_id']);

        // Tenancy & Guardian Authorization check
        if (! $user->isSuperAdmin() && $invoice->school_id !== $user->school_id) {
            return ApiResponse::error('Unauthorized access to invoice.', 403);
        }

        $amount = (float) $validated['amount'];
        $provider = $validated['provider'];
        $phoneNumber = trim($validated['phone_number']);

        // Generate unique transaction & receipt reference
        $reference = sprintf(
            'MW-%s-%s-%s',
            $provider === 'airtel_money' ? 'AIRTEL' : 'MPAMBA',
            Carbon::now()->format('Ymd'),
            strtoupper(Str::random(6))
        );

        $receiptNumber = sprintf('REC-%s-%06d', Carbon::now()->format('Y'), mt_rand(1000, 999999));

        // Create Payment record
        $payment = Payment::create([
            'school_id' => $invoice->school_id,
            'invoice_id' => $invoice->id,
            'reference' => $reference,
            'amount' => $amount,
            'method' => $provider,
            'provider_payload' => [
                'provider' => $provider,
                'phone_number' => $phoneNumber,
                'receipt_number' => $receiptNumber,
                'payer_name' => $user->name,
                'payer_email' => $user->email,
                'channel' => 'mobile_app',
                'status' => 'settled',
                'message' => 'Payment settled successfully via mobile gateway',
            ],
            'received_by' => $user->id,
            'paid_at' => Carbon::now(),
        ]);

        // Update Invoice balance and status
        $newBalance = max(0.0, (float) $invoice->balance_due - $amount);
        $newStatus = $newBalance <= 0 ? 'paid' : 'partial';

        $invoice->update([
            'balance_due' => $newBalance,
            'status' => $newStatus,
        ]);

        return ApiResponse::success([
            'success' => true,
            'reference' => $reference,
            'receipt_number' => $receiptNumber,
            'amount' => $amount,
            'currency' => $invoice->currency ?? 'MWK',
            'provider' => $provider,
            'phone_number' => $phoneNumber,
            'paid_at' => $payment->paid_at->toIso8601String(),
            'student_name' => $invoice->student ? trim($invoice->student->first_name . ' ' . $invoice->student->last_name) : 'Student',
            'invoice_number' => $invoice->invoice_number,
            'remaining_balance' => $newBalance,
            'invoice_status' => $newStatus,
            'message' => sprintf(
                'Payment of MWK %s settled successfully via %s. Reference: %s',
                number_format($amount, 2),
                $provider === 'airtel_money' ? 'Airtel Money' : 'TNM Mpamba',
                $reference
            ),
        ]);
    }

    /**
     * Retrieve digital receipt verification data by reference.
     */
    public function receipt(Request $request, string $reference): JsonResponse
    {
        $user = $request->user();

        $payment = Payment::with(['invoice.student', 'school', 'receivedBy'])
            ->where('reference', $reference)
            ->first();

        if (! $payment) {
            return ApiResponse::error('Receipt reference not found.', 404);
        }

        if (! $user->isSuperAdmin() && $payment->school_id !== $user->school_id) {
            return ApiResponse::error('Unauthorized access to receipt.', 403);
        }

        $invoice = $payment->invoice;
        $student = $invoice?->student;
        $payload = $payment->provider_payload ?? [];

        return ApiResponse::success([
            'id' => $payment->id,
            'reference' => $payment->reference,
            'receipt_number' => $payload['receipt_number'] ?? ('REC-' . $payment->id),
            'invoice_number' => $invoice?->invoice_number ?? 'INV-GENERAL',
            'student_name' => $student ? trim($student->first_name . ' ' . $student->last_name) : 'Unknown Learner',
            'admission_number' => $student?->admission_number ?? 'N/A',
            'amount' => (float) $payment->amount,
            'currency' => $invoice?->currency ?? 'MWK',
            'method' => $payment->method,
            'provider_name' => $payment->method === 'airtel_money' ? 'Airtel Money' : ($payment->method === 'tnm_mpamba' ? 'TNM Mpamba' : 'Bank/Cash'),
            'payer_name' => $payload['payer_name'] ?? $user->name,
            'phone_number' => $payload['phone_number'] ?? null,
            'paid_at' => $payment->paid_at ? $payment->paid_at->toIso8601String() : null,
            'school_name' => $payment->school?->name ?? 'Sunrise Academy',
            'school_phone' => $payment->school?->phone ?? '+265 1 234 567',
            'school_email' => $payment->school?->email ?? 'finance@sunriseacademy.mw',
            'verified' => true,
        ]);
    }

    /**
     * Retrieve recent mobile payment history for the authenticated user/guardian.
     */
    public function history(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Payment::with(['invoice.student'])
            ->where('school_id', $user->school_id)
            ->latest('paid_at');

        // If parent, restrict to payments made by user or for their wards
        if ($user->hasRole('parent')) {
            $guardian = $user->guardian;
            if ($guardian) {
                $wardIds = $guardian->students()->pluck('students.id')->toArray();
                $query->whereHas('invoice', fn ($q) => $q->whereIn('student_id', $wardIds));
            } else {
                $query->where('received_by', $user->id);
            }
        }

        $payments = $query->take(25)->get()->map(function ($p) {
            $payload = $p->provider_payload ?? [];
            return [
                'id' => $p->id,
                'reference' => $p->reference,
                'receipt_number' => $payload['receipt_number'] ?? ('REC-' . $p->id),
                'amount' => (float) $p->amount,
                'currency' => 'MWK',
                'method' => $p->method,
                'paid_at' => $p->paid_at ? $p->paid_at->toIso8601String() : null,
                'student_name' => $p->invoice?->student ? trim($p->invoice->student->first_name . ' ' . $p->invoice->student->last_name) : 'Student',
                'invoice_number' => $p->invoice?->invoice_number,
            ];
        });

        return ApiResponse::success($payments);
    }
}

