<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $departments = Department::where('school_id', $schoolId)->with('headOfDepartment')->get();
        return response()->json(['data' => $departments]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:academic,administrative',
            'description' => 'nullable|string',
            'head_of_department_id' => 'nullable|exists:users,id',
        ]);

        $schoolId = $request->user()->school_id;

        $department = Department::create([
            'school_id' => $schoolId,
            'name' => $request->name,
            'type' => $request->type,
            'description' => $request->description,
            'head_of_department_id' => $request->head_of_department_id,
        ]);

        return response()->json(['message' => 'Department created successfully.', 'data' => $department], 201);
    }

    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);
        
        $request->validate([
            'name' => 'string|max:255',
            'type' => 'string|in:academic,administrative',
            'description' => 'nullable|string',
            'head_of_department_id' => 'nullable|exists:users,id',
        ]);

        $department->update($request->all());

        return response()->json(['message' => 'Department updated successfully.', 'data' => $department]);
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();
        return response()->json(['message' => 'Department deleted successfully.']);
    }
}
