<?php

namespace App\Http\Controllers\Web\Finance;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeFinance($request);
        $schoolId = $request->user()->school_id;

        $payments = Payment::query()
            ->with(['invoice.student:id,first_name,last_name,admission_number', 'receivedBy:id,name'])
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->orderByDesc('paid_at')
            ->paginate(20);

        return Inertia::render('Finance/Payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizeFinance($request);
        $schoolId = $request->user()->school_id;

        $openInvoices = Invoice::query()
            ->with('student:id,first_name,last_name,admission_number')
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->where('balance_due', '>', 0)
            ->whereNotIn('status', ['paid', 'cancelled'])
            ->orderBy('due_date')
            ->get();

        return Inertia::render('Finance/Payments/Create', [
            'invoices' => $openInvoices,
            'preselectedInvoiceId' => $request->query('invoice'),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeFinance($request);

        $validated = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric|min:0.01',
            'method' => 'required|string|in:cash,airtel_money,mpamba,bank_transfer,cheque',
            'reference' => 'nullable|string|max:100',
            'paid_at' => 'nullable|date',
        ]);

        $invoice = Invoice::findOrFail($validated['invoice_id']);
        abort_unless($invoice->school_id === $request->user()->school_id, 403);

        if ($validated['amount'] > $invoice->balance_due) {
            return back()->withErrors(['amount' => 'Payment exceeds outstanding balance.']);
        }

        DB::transaction(function () use ($request, $validated, $invoice) {
            Payment::create([
                'school_id' => $invoice->school_id,
                'invoice_id' => $invoice->id,
                'reference' => $validated['reference'] ?? ('RCPT-' . strtoupper(Str::random(8))),
                'amount' => $validated['amount'],
                'method' => $validated['method'],
                'received_by' => $request->user()->id,
                'paid_at' => $validated['paid_at'] ?? now(),
            ]);

            $newBalance = max(0, (float) $invoice->balance_due - (float) $validated['amount']);
            $status = $newBalance <= 0 ? 'paid' : 'partially_paid';

            $invoice->update([
                'balance_due' => $newBalance,
                'status' => $status,
            ]);
        });

        return redirect()->route('finance.invoices.show', $invoice)->with('success', 'Payment recorded successfully.');
    }

    protected function authorizeFinance(Request $request): void
    {
        abort_unless($request->user()->can('finance.manage'), 403);
    }
}
