<?php

namespace App\Http\Controllers\Web\Portal;

use App\Http\Controllers\Concerns\AuthorizesPortalStudent;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalHealthController extends Controller
{
    use AuthorizesPortalStudent;

    public function show(Request $request, Student $student): Response
    {
        $this->authorizePortalStudent($request, $student);

        $student->load(['school', 'medicalRecord']);

        $clinicVisits = \App\Models\ClinicVisit::where('student_id', $student->id)->latest('date')->get();

        return Inertia::render('Portal/Child/Health', [
            'student' => $student,
            'medicalRecord' => $student->medicalRecord,
            'clinicVisits' => $clinicVisits,
        ]);
    }
}
