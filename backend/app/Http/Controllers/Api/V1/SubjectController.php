<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $subjects = Subject::where('school_id', $schoolId)->with(['department', 'teacher'])->get();
        return response()->json(['data' => $subjects]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:40',
            'name' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'teacher_id' => 'nullable|exists:users,id',
            'type' => 'required|string|in:compulsory,elective',
            'pass_mark' => 'required|numeric|min:0|max:100',
        ]);

        $schoolId = $request->user()->school_id;

        $subject = Subject::create([
            'school_id' => $schoolId,
            'code' => $request->code,
            'name' => $request->name,
            'department_id' => $request->department_id,
            'teacher_id' => $request->teacher_id,
            'type' => $request->type,
            'pass_mark' => $request->pass_mark,
        ]);

        return response()->json(['message' => 'Subject created successfully.', 'data' => $subject], 201);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);
        
        $request->validate([
            'code' => 'string|max:40',
            'name' => 'string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'teacher_id' => 'nullable|exists:users,id',
            'type' => 'string|in:compulsory,elective',
            'pass_mark' => 'numeric|min:0|max:100',
        ]);

        $subject->update($request->all());

        return response()->json(['message' => 'Subject updated successfully.', 'data' => $subject]);
    }

    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();
        return response()->json(['message' => 'Subject deleted successfully.']);
    }
}
