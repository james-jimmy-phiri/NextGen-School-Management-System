<?php

namespace App\Http\Controllers\Web\Finance;

use App\Http\Controllers\Controller;
use App\Models\FeeStructure;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeFinance($request);
        $schoolId = $request->user()->school_id;

        $invoices = Invoice::query()
            ->with(['student:id,first_name,last_name,admission_number', 'feeStructure:id,name'])
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = '%' . $request->string('search') . '%';
                $q->where(function ($inner) use ($search) {
                    $inner->where('invoice_number', 'like', $search)
                        ->orWhereHas('student', fn ($s) => $s->where('first_name', 'like', $search)
                            ->orWhere('last_name', 'like', $search)
                            ->orWhere('admission_number', 'like', $search));
                });
            })
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        $debtorsTotal = Invoice::query()
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->where('balance_due', '>', 0)
            ->whereNotIn('status', ['paid', 'cancelled'])
            ->sum('balance_due');

        return Inertia::render('Finance/Invoices/Index', [
            'invoices' => $invoices,
            'debtorsTotal' => (float) $debtorsTotal,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Request $request, Invoice $invoice)
    {
        $this->authorizeFinance($request);
        $this->assertSchool($request, $invoice->school_id);

        $invoice->load(['student', 'feeStructure', 'lines', 'payments.receivedBy:id,name']);

        return Inertia::render('Finance/Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizeFinance($request);
        $schoolId = $request->user()->school_id;

        return Inertia::render('Finance/Invoices/Create', [
            'students' => Student::query()
                ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
                ->where('status', 'active')
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name', 'admission_number']),
            'feeStructures' => FeeStructure::query()
                ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
                ->orderBy('name')
                ->get(['id', 'name', 'components', 'academic_year_id']),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeFinance($request);

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'fee_structure_id' => 'required|exists:fee_structures,id',
            'due_date' => 'nullable|date',
        ]);

        $student = Student::findOrFail($validated['student_id']);
        $feeStructure = FeeStructure::findOrFail($validated['fee_structure_id']);

        abort_unless($student->school_id === $request->user()->school_id, 403);
        abort_unless($feeStructure->school_id === $request->user()->school_id, 403);

        $components = $feeStructure->components ?? [];
        $subtotal = collect($components)->sum(fn ($c) => (float) ($c['amount'] ?? 0));
        $discount = 0;
        $total = $subtotal - $discount;

        $invoiceNumber = 'INV-' . date('Y') . '-' . strtoupper(Str::random(6));

        $invoice = Invoice::create([
            'school_id' => $request->user()->school_id,
            'student_id' => $student->id,
            'fee_structure_id' => $feeStructure->id,
            'invoice_number' => $invoiceNumber,
            'currency' => $student->school?->currency ?? 'MWK',
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total' => $total,
            'balance_due' => $total,
            'status' => 'issued',
            'due_date' => $validated['due_date'] ?? now()->addDays(30),
        ]);

        foreach ($components as $component) {
            InvoiceLine::create([
                'invoice_id' => $invoice->id,
                'description' => $component['label'] ?? 'Fee item',
                'quantity' => 1,
                'unit_price' => $component['amount'] ?? 0,
                'tax' => 0,
                'total' => $component['amount'] ?? 0,
            ]);
        }

        return redirect()->route('finance.invoices.show', $invoice)->with('success', 'Invoice generated.');
    }

    protected function authorizeFinance(Request $request): void
    {
        abort_unless($request->user()->can('finance.manage') || $request->user()->can('finance.view'), 403);
    }

    protected function assertSchool(Request $request, int $schoolId): void
    {
        if (! $request->user()->isSuperAdmin()) {
            abort_unless($request->user()->school_id === $schoolId, 403);
        }
    }
}
