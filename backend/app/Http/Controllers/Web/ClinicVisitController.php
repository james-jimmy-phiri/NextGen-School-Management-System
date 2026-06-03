<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ClinicVisit;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClinicVisitController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $visits = ClinicVisit::with(['student'])
            ->when($search, function ($query, $search) {
                $query->whereHas('student', function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('admission_number', 'like', "%{$search}%");
                })->orWhere('condition', 'like', "%{$search}%");
            })
            ->latest('date')
            ->paginate(15)
            ->withQueryString();

        $students = Student::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'admission_number']);

        return Inertia::render('ClinicVisits/Index', [
            'visits' => $visits,
            'students' => $students,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'condition' => 'required|string|max:255',
            'action' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        ClinicVisit::create($validated);

        return redirect()->back()->with('success', 'Clinic visit recorded successfully.');
    }

    public function update(Request $request, ClinicVisit $clinicVisit)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'condition' => 'required|string|max:255',
            'action' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $clinicVisit->update($validated);

        return redirect()->back()->with('success', 'Clinic visit updated successfully.');
    }

    public function destroy(ClinicVisit $clinicVisit)
    {
        $clinicVisit->delete();

        return redirect()->back()->with('success', 'Clinic visit deleted successfully.');
    }
}
