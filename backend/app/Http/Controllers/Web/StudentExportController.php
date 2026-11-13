<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ClassGroup;
use App\Models\Student;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StudentExportController extends Controller
{
    public function students(Request $request): StreamedResponse
    {
        $this->authorize('viewAny', Student::class);

        $schoolId = $request->user()->school_id;
        $students = Student::query()
            ->when(! $request->user()->isSuperAdmin(), fn ($q) => $q->where('school_id', $schoolId))
            ->with(['enrollments.classGroup', 'guardians', 'family'])
            ->orderBy('last_name')
            ->get();

        activity('export')
            ->causedBy($request->user())
            ->withProperties(['type' => 'students_csv', 'count' => $students->count()])
            ->log('Exported student records');

        return $this->csv('students.csv', [
            'Admission number', 'First name', 'Last name', 'Gender', 'Status', 'Class', 'Family', 'Guardian',
        ], $students->map(fn (Student $s) => [
            $s->admission_number,
            $s->first_name,
            $s->last_name,
            $s->gender,
            $s->status,
            $s->enrollments->first()?->classGroup?->name,
            $s->family?->name,
            $s->guardians->map(fn ($g) => trim($g->first_name.' '.$g->last_name))->implode('; '),
        ])->all());
    }

    public function classList(Request $request): StreamedResponse
    {
        $this->authorize('viewAny', Student::class);

        $validated = $request->validate([
            'class_group_id' => ['required', 'exists:class_groups,id'],
        ]);

        $class = ClassGroup::query()
            ->when(! $request->user()->isSuperAdmin(), fn ($q) => $q->where('school_id', $request->user()->school_id))
            ->findOrFail($validated['class_group_id']);

        $students = Student::query()
            ->where('school_id', $class->school_id)
            ->where('status', 'active')
            ->whereHas('enrollments', fn ($q) => $q->where('class_group_id', $class->id)->where('status', 'enrolled'))
            ->orderBy('last_name')
            ->get();

        activity('export')
            ->causedBy($request->user())
            ->withProperties(['type' => 'class_list', 'class_group_id' => $class->id, 'count' => $students->count()])
            ->log('Exported class list');

        return $this->csv('class-list-'.$class->id.'.csv', [
            'Admission number', 'Last name', 'First name', 'Gender', 'Status',
        ], $students->map(fn (Student $s) => [
            $s->admission_number,
            $s->last_name,
            $s->first_name,
            $s->gender,
            $s->status,
        ])->all());
    }

    /**
     * @param  list<string>  $headers
     * @param  list<list<mixed>>  $rows
     */
    private function csv(string $filename, array $headers, array $rows): StreamedResponse
    {
        return response()->streamDownload(function () use ($headers, $rows): void {
            $out = fopen('php://output', 'w');
            fputcsv($out, $headers);
            foreach ($rows as $row) {
                fputcsv($out, $row);
            }
            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv']);
    }
}
