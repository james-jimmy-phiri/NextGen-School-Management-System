<?php

namespace App\Http\Controllers\Web\Portal;

use App\Http\Controllers\Concerns\AuthorizesPortalStudent;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalFinanceController extends Controller
{
    use AuthorizesPortalStudent;

    public function show(Request $request, Student $student): Response
    {
        $this->authorizePortalStudent($request, $student);

        $student->load('school');

        // Fetch actual invoices and payments if they exist
        $invoices = Invoice::where('student_id', $student->id)->with('lines')->latest()->get();
        $payments = Payment::whereHas('invoice', function($q) use ($student) {
            $q->where('student_id', $student->id);
        })->latest()->get();

        // If no real data, use demo data for the prototype
        if ($invoices->isEmpty()) {
            $totalFees = 330000;
            $amountPaid = 150000;
            $balanceDue = $totalFees - $amountPaid;
            
            $demoInvoices = [
                [
                    'id' => 1,
                    'invoice_number' => 'INV-2026-001',
                    'term' => 'Term 2, 2026',
                    'total' => $totalFees,
                    'balance_due' => $balanceDue,
                    'status' => 'partial',
                    'due_date' => '2026-06-30',
                    'lines' => [
                        ['description' => 'Tuition Fee', 'amount' => 250000],
                        ['description' => 'Transport', 'amount' => 30000],
                        ['description' => 'Uniform', 'amount' => 50000],
                    ]
                ]
            ];

            $demoPayments = [
                ['id' => 1, 'reference' => 'RCP-001', 'amount' => 50000, 'method' => 'Bank Transfer', 'paid_at' => '2026-05-01T10:00:00Z'],
                ['id' => 2, 'reference' => 'RCP-002', 'amount' => 100000, 'method' => 'Mobile Money', 'paid_at' => '2026-06-01T14:30:00Z'],
            ];

            return Inertia::render('Portal/Child/Fees', [
                'student' => $student,
                'summary' => [
                    'total_fees' => $totalFees,
                    'amount_paid' => $amountPaid,
                    'balance_due' => $balanceDue,
                    'currency' => 'MWK'
                ],
                'invoices' => $demoInvoices,
                'payments' => $demoPayments,
            ]);
        }

        // Calculate summary from real data
        $summary = [
            'total_fees' => $invoices->sum('total'),
            'amount_paid' => $payments->sum('amount'),
            'balance_due' => $invoices->sum('balance_due'),
            'currency' => $invoices->first()?->currency ?? 'MWK'
        ];

        return Inertia::render('Portal/Child/Fees', [
            'student' => $student,
            'summary' => $summary,
            'invoices' => $invoices,
            'payments' => $payments,
        ]);
    }
}
