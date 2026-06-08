<?php

namespace App\Http\Controllers\Web\Finance;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\FeeStructure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeeStructureController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeFinance($request);

        $schoolId = $request->user()->school_id;

        $structures = FeeStructure::query()
            ->with('academicYear:id,title')
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Finance/FeeStructures/Index', [
            'structures' => $structures,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorizeFinance($request);
        $schoolId = $request->user()->school_id;

        return Inertia::render('Finance/FeeStructures/Create', [
            'academicYears' => AcademicYear::query()
                ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
                ->orderByDesc('starts_on')
                ->get(['id', 'title', 'is_current']),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeFinance($request);

        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'components' => 'required|array|min:1',
            'components.*.label' => 'required|string|max:150',
            'components.*.amount' => 'required|numeric|min:0',
            'allow_installments' => 'boolean',
            'penalty_percent' => 'nullable|numeric|min:0|max:100',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
        ]);

        FeeStructure::create([
            'school_id' => $request->user()->school_id,
            'academic_year_id' => $validated['academic_year_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'components' => $validated['components'],
            'allow_installments' => $validated['allow_installments'] ?? false,
            'penalty_percent' => $validated['penalty_percent'] ?? 0,
            'discount_percent' => $validated['discount_percent'] ?? 0,
        ]);

        return redirect()->route('finance.fee-structures.index')->with('success', 'Fee structure created.');
    }

    protected function authorizeFinance(Request $request): void
    {
        abort_unless($request->user()->can('finance.manage') || $request->user()->can('finance.view'), 403);
    }
}
