<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $years = AcademicYear::where('school_id', $schoolId)->latest()->get();
        return response()->json(['data' => $years]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'starts_on' => 'required|date',
            'ends_on' => 'required|date|after:starts_on',
            'is_current' => 'boolean',
            'status' => 'string|in:active,archived'
        ]);

        $schoolId = $request->user()->school_id;

        // If this one is set to current, unset others
        if ($request->is_current) {
            AcademicYear::where('school_id', $schoolId)->update(['is_current' => false]);
        }

        $year = AcademicYear::create([
            'school_id' => $schoolId,
            'title' => $request->title,
            'starts_on' => $request->starts_on,
            'ends_on' => $request->ends_on,
            'is_current' => $request->is_current ?? false,
            'status' => $request->status ?? 'active',
            'created_by' => $request->user()->id,
        ]);

        return response()->json(['message' => 'Academic year created successfully.', 'data' => $year], 201);
    }

    public function update(Request $request, $id)
    {
        $year = AcademicYear::findOrFail($id);
        
        $request->validate([
            'title' => 'string|max:255',
            'starts_on' => 'date',
            'ends_on' => 'date|after:starts_on',
            'is_current' => 'boolean',
            'status' => 'string|in:active,archived'
        ]);

        if ($request->is_current) {
            AcademicYear::where('school_id', $year->school_id)->where('id', '!=', $id)->update(['is_current' => false]);
        }

        $year->update($request->all());

        return response()->json(['message' => 'Academic year updated successfully.', 'data' => $year]);
    }

    public function destroy($id)
    {
        $year = AcademicYear::findOrFail($id);
        $year->delete();
        return response()->json(['message' => 'Academic year deleted successfully.']);
    }
}
