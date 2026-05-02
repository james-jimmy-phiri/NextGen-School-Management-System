<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParentPortalController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $students = Student::query()
            ->whereHas('guardians', fn ($query) => $query->where('user_id', $request->user()->id))
            ->with(['guardians', 'enrollments.classGroup.academicYear', 'school'])
            ->latest()
            ->get();

        return Inertia::render('Portal/Dashboard', [
            'students' => $students,
        ]);
    }
}
