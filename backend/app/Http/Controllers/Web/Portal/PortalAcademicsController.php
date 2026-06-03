<?php

namespace App\Http\Controllers\Web\Portal;

use App\Http\Controllers\Concerns\AuthorizesPortalStudent;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\AssessmentMark;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalAcademicsController extends Controller
{
    use AuthorizesPortalStudent;

    public function show(Request $request, Student $student): Response
    {
        $this->authorizePortalStudent($request, $student);

        $student->load('school');

        // Fetch actual marks
        $marks = $student->marks()->with(['assessment.subject', 'assessment.term'])->get();

        $subjects = $student->subjects()->get()->map(function ($subject) use ($marks) {
            $subjectMarks = $marks->where('assessment.subject_id', $subject->id);
            $score = $subjectMarks->count() > 0 ? $subjectMarks->avg('score') : null;
            return [
                'id' => $subject->id,
                'name' => $subject->name,
                'code' => $subject->code,
                'score' => $score !== null ? round($score) : null,
                'grade' => $score !== null ? ($score >= 80 ? 'A' : ($score >= 70 ? 'B' : ($score >= 60 ? 'C' : 'D'))) : '-',
                'comment' => $score !== null ? ($score >= 80 ? 'Excellent' : 'Good progress') : 'No marks yet',
            ];
        });

        // Historical data from actual assessments grouped by term
        $history = $marks->groupBy(function ($mark) {
            return $mark->assessment->term->name ?? 'Unknown Term';
        })->map(function ($termMarks, $termName) {
            return [
                'term' => $termName,
                'average' => round($termMarks->avg('score')),
            ];
        })->values()->all();

        // Actual assessments
        $assessments = $marks->map(function ($mark) {
            return [
                'id' => $mark->assessment->id,
                'title' => $mark->assessment->title,
                'type' => $mark->assessment->type,
                'subject' => $mark->assessment->subject->name ?? '-',
                'score' => $mark->score,
                'max_score' => $mark->assessment->max_score,
                'date' => $mark->assessment->due_at ? $mark->assessment->due_at->toDateString() : null,
                'remarks' => $mark->comment ?? '-',
            ];
        })->all();

        return Inertia::render('Portal/Child/Academics', [
            'student' => $student,
            'subjects' => $subjects,
            'history' => $history,
            'assessments' => $assessments,
            'summary' => [
                'average' => $subjects->whereNotNull('score')->count() > 0 ? round($subjects->whereNotNull('score')->avg('score')) : 0,
                'position' => null,
                'total_students' => null,
                'term' => 'Current Term',
            ]
        ]);
    }
}
