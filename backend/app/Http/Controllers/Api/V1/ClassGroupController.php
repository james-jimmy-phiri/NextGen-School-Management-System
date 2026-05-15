<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ClassGroup;
use Illuminate\Http\Request;

class ClassGroupController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $classes = ClassGroup::where('school_id', $schoolId)
            ->with(['academicYear', 'gradeLevel', 'homeroomTeacher'])
            ->get();
        return response()->json(['data' => $classes]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'grade_level_id' => 'required|exists:grade_levels,id',
            'name' => 'required|string|max:255',
            'level' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'homeroom_teacher_id' => 'nullable|exists:users,id',
        ]);

        $schoolId = $request->user()->school_id;

        $class = ClassGroup::create([
            'school_id' => $schoolId,
            'academic_year_id' => $request->academic_year_id,
            'grade_level_id' => $request->grade_level_id,
            'name' => $request->name,
            'level' => $request->level,
            'description' => $request->description,
            'homeroom_teacher_id' => $request->homeroom_teacher_id,
        ]);

        return response()->json(['message' => 'Class created successfully.', 'data' => $class], 201);
    }

    public function update(Request $request, $id)
    {
        $class = ClassGroup::findOrFail($id);
        
        $request->validate([
            'name' => 'string|max:255',
            'level' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'homeroom_teacher_id' => 'nullable|exists:users,id',
        ]);

        $class->update($request->all());

        return response()->json(['message' => 'Class updated successfully.', 'data' => $class]);
    }

    public function destroy($id)
    {
        $class = ClassGroup::findOrFail($id);
        $class->delete();
        return response()->json(['message' => 'Class deleted successfully.']);
    }
}
