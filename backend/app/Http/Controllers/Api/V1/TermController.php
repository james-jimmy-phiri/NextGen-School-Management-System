<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Term;
use Illuminate\Http\Request;

class TermController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $terms = Term::where('school_id', $schoolId)->with('academicYear')->get();
        return response()->json(['data' => $terms]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'name' => 'required|string|max:255',
            'starts_on' => 'nullable|date',
            'ends_on' => 'nullable|date|after_or_equal:starts_on',
            'is_active' => 'boolean',
        ]);

        $schoolId = $request->user()->school_id;
        
        // Disable other terms if this one is active
        if ($request->is_active) {
            Term::where('school_id', $schoolId)->update(['is_active' => false]);
        }

        $term = Term::create([
            'school_id' => $schoolId,
            'academic_year_id' => $request->academic_year_id,
            'name' => $request->name,
            'starts_on' => $request->starts_on,
            'ends_on' => $request->ends_on,
            'is_active' => $request->is_active ?? true,
            'position' => Term::where('academic_year_id', $request->academic_year_id)->count() + 1,
        ]);

        return response()->json(['message' => 'Term created successfully.', 'data' => $term], 201);
    }

    public function update(Request $request, $id)
    {
        $term = Term::findOrFail($id);
        
        $request->validate([
            'name' => 'string|max:255',
            'starts_on' => 'nullable|date',
            'ends_on' => 'nullable|date|after_or_equal:starts_on',
            'is_active' => 'boolean',
        ]);

        if ($request->is_active) {
            Term::where('school_id', $term->school_id)->where('id', '!=', $id)->update(['is_active' => false]);
        }

        $term->update($request->all());

        return response()->json(['message' => 'Term updated successfully.', 'data' => $term]);
    }

    public function destroy($id)
    {
        $term = Term::findOrFail($id);
        $term->delete();
        return response()->json(['message' => 'Term deleted successfully.']);
    }
}
