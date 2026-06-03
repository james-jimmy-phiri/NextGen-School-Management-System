<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\StudentAward;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentAwardController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $awards = StudentAward::with(['student'])
            ->when($search, function ($query, $search) {
                $query->whereHas('student', function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('admission_number', 'like', "%{$search}%");
                })->orWhere('title', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            })
            ->latest('date')
            ->paginate(15)
            ->withQueryString();

        $students = Student::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'admission_number']);

        return Inertia::render('StudentAwards/Index', [
            'awards' => $awards,
            'students' => $students,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        StudentAward::create($validated);

        return redirect()->back()->with('success', 'Student award recorded successfully.');
    }

    public function update(Request $request, StudentAward $studentAward)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $studentAward->update($validated);

        return redirect()->back()->with('success', 'Student award updated successfully.');
    }

    public function destroy(StudentAward $studentAward)
    {
        $studentAward->delete();

        return redirect()->back()->with('success', 'Student award deleted successfully.');
    }
}
