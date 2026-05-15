<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolSetupController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $school = School::find($schoolId) ?? School::first();
        
        return Inertia::render('SchoolSetup/Index', [
            'school' => $school,
            'permissions' => [
                'can_edit_school' => $request->user()->can('school_setup.edit'),
                'can_manage_academic_years' => $request->user()->can('academic_years.manage'),
                'can_manage_terms' => $request->user()->can('terms.manage'),
                'can_manage_classes' => $request->user()->can('classes.manage'),
                'can_manage_subjects' => $request->user()->can('subjects.manage'),
                'can_manage_grading' => $request->user()->can('grading.manage'),
            ]
        ]);
    }
}
