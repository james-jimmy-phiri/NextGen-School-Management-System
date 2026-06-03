<?php

namespace App\Http\Controllers\Web\Portal;

use App\Http\Controllers\Concerns\AuthorizesPortalStudent;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\DisciplineRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalBehaviourController extends Controller
{
    use AuthorizesPortalStudent;

    public function show(Request $request, Student $student): Response
    {
        $this->authorizePortalStudent($request, $student);

        $student->load('school');

        $records = DisciplineRecord::where('student_id', $student->id)->latest('date')->get();

        $awards = \App\Models\StudentAward::where('student_id', $student->id)->latest('date')->get();

        return Inertia::render('Portal/Child/Behaviour', [
            'student' => $student,
            'records' => $records,
            'awards' => $awards,
            'summary' => [
                'points' => 100 - $records->sum('points_deducted'),
                'incidents' => $records->count(),
            ]
        ]);
    }
}
