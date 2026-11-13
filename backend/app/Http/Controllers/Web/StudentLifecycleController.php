<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ClassGroup;
use App\Models\Student;
use App\Services\StudentLifecycleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentLifecycleController extends Controller
{
    public function __construct(private readonly StudentLifecycleService $lifecycle) {}

    public function promotion(Request $request): Response
    {
        $this->authorize('create', Student::class);
        $schoolId = $request->user()->school_id;

        $students = Student::query()
            ->where('school_id', $schoolId)
            ->where('status', 'active')
            ->with(['enrollments.classGroup'])
            ->orderBy('last_name')
            ->get(['id', 'admission_number', 'first_name', 'last_name', 'status']);

        $withBalances = $students->map(function (Student $student) {
            $balance = $this->lifecycle->outstandingBalance($student);
            $enrollment = $student->enrollments->first();

            return [
                'id' => $student->id,
                'admission_number' => $student->admission_number,
                'name' => $student->first_name.' '.$student->last_name,
                'class' => $enrollment?->classGroup?->name,
                'outstanding_balance' => $balance,
            ];
        });

        return Inertia::render('Students/Promotion', [
            'students' => $withBalances,
            'classGroups' => ClassGroup::query()->where('school_id', $schoolId)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function promote(Request $request): RedirectResponse
    {
        $this->authorize('create', Student::class);

        $validated = $request->validate([
            'student_ids' => ['required', 'array', 'min:1'],
            'student_ids.*' => ['integer', 'exists:students,id'],
            'to_class_group_id' => ['required', 'exists:class_groups,id'],
            'repeat_ids' => ['array'],
            'repeat_ids.*' => ['integer'],
        ]);

        $count = $this->lifecycle->promote(
            (int) $request->user()->school_id,
            $validated['student_ids'],
            (int) $validated['to_class_group_id'],
            $validated['repeat_ids'] ?? [],
        );

        activity('student')
            ->causedBy($request->user())
            ->withProperties($validated)
            ->log("Promoted {$count} learners");

        return back()->with('success', "Updated {$count} learner enrolments.");
    }

    public function transfers(Request $request): Response
    {
        $this->authorize('create', Student::class);
        $schoolId = $request->user()->school_id;

        return Inertia::render('Students/Transfers', [
            'students' => Student::query()
                ->where('school_id', $schoolId)
                ->where('status', 'active')
                ->orderBy('last_name')
                ->get(['id', 'admission_number', 'first_name', 'last_name']),
            'history' => \App\Models\StudentTransfer::query()
                ->where('school_id', $schoolId)
                ->with('student:id,first_name,last_name,admission_number')
                ->latest()
                ->limit(50)
                ->get(),
        ]);
    }

    public function transfer(Request $request): RedirectResponse
    {
        $this->authorize('create', Student::class);

        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'reason' => ['required', 'string', 'max:255'],
            'destination' => ['nullable', 'string', 'max:255'],
            'clearance.fees' => ['boolean'],
            'clearance.library' => ['boolean'],
            'clearance.stores' => ['boolean'],
        ]);

        $student = Student::query()->where('school_id', $request->user()->school_id)->findOrFail($validated['student_id']);
        $this->lifecycle->transferOut(
            $student,
            $validated['reason'],
            $validated['clearance'] ?? [],
            $validated['destination'] ?? null,
        );

        activity('student')->causedBy($request->user())->performedOn($student)->log('Transfer out');

        return back()->with('success', 'Transfer recorded.');
    }

    public function alumni(Request $request): Response
    {
        $this->authorize('viewAny', Student::class);

        return Inertia::render('Students/Alumni', [
            'students' => Student::query()
                ->when(! $request->user()->isSuperAdmin(), fn ($q) => $q->where('school_id', $request->user()->school_id))
                ->where('status', 'graduated')
                ->orderByDesc('left_on')
                ->paginate(20),
        ]);
    }

    public function graduate(Request $request): RedirectResponse
    {
        $this->authorize('create', Student::class);

        $validated = $request->validate([
            'student_ids' => ['required', 'array', 'min:1'],
            'student_ids.*' => ['integer', 'exists:students,id'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $students = Student::query()
            ->where('school_id', $request->user()->school_id)
            ->whereIn('id', $validated['student_ids'])
            ->get();

        foreach ($students as $student) {
            $this->lifecycle->graduate($student, $validated['reason'] ?? 'Graduated');
        }

        activity('student')->causedBy($request->user())->log('Marked '.$students->count().' learners as graduated');

        return back()->with('success', 'Learners marked as graduated.');
    }
}
