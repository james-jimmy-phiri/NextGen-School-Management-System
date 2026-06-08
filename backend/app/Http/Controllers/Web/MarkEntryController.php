<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\AssessmentMark;
use App\Models\ClassGroup;
use App\Models\Student;
use App\Models\StudentEnrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarkEntryController extends Controller
{
    public function index(Request $request)
    {
        abort_unless($request->user()->hasAnyRole(['teacher', 'school_admin', 'principal']), 403);

        $schoolId = $request->user()->school_id;

        $assessments = Assessment::query()
            ->with(['subject:id,name', 'classGroup:id,name', 'term:id,name'])
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->orderByDesc('due_at')
            ->paginate(15);

        return Inertia::render('Academics/Marks/Index', [
            'assessments' => $assessments,
        ]);
    }

    public function edit(Request $request, Assessment $assessment)
    {
        abort_unless($request->user()->hasAnyRole(['teacher', 'school_admin', 'principal']), 403);
        abort_unless($assessment->school_id === $request->user()->school_id, 403);

        $enrolledIds = StudentEnrollment::query()
            ->where('class_group_id', $assessment->class_group_id)
            ->when($assessment->academic_year_id, fn ($q) => $q->where('academic_year_id', $assessment->academic_year_id))
            ->pluck('student_id');

        $students = Student::query()
            ->whereIn('id', $enrolledIds)
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'admission_number']);

        $marks = AssessmentMark::query()
            ->where('assessment_id', $assessment->id)
            ->get()
            ->keyBy('student_id');

        $assessment->load(['subject', 'classGroup', 'term']);

        return Inertia::render('Academics/Marks/Edit', [
            'assessment' => $assessment,
            'students' => $students,
            'marks' => $marks,
        ]);
    }

    public function update(Request $request, Assessment $assessment)
    {
        abort_unless($request->user()->hasAnyRole(['teacher', 'school_admin', 'principal']), 403);
        abort_unless($assessment->school_id === $request->user()->school_id, 403);

        $validated = $request->validate([
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:students,id',
            'marks.*.score' => 'nullable|numeric|min:0|max:' . $assessment->max_score,
            'marks.*.comment' => 'nullable|string|max:500',
        ]);

        foreach ($validated['marks'] as $row) {
            if ($row['score'] === null || $row['score'] === '') {
                AssessmentMark::query()
                    ->where('assessment_id', $assessment->id)
                    ->where('student_id', $row['student_id'])
                    ->delete();
                continue;
            }

            AssessmentMark::updateOrCreate(
                [
                    'assessment_id' => $assessment->id,
                    'student_id' => $row['student_id'],
                ],
                [
                    'school_id' => $assessment->school_id,
                    'score' => $row['score'],
                    'comment' => $row['comment'] ?? null,
                ]
            );
        }

        return redirect()->route('academics.marks.index')->with('success', 'Marks saved.');
    }
}
