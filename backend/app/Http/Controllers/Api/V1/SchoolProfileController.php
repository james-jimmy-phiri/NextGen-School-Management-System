<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;

class SchoolProfileController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $school = School::find($schoolId) ?? School::first();
        return response()->json(['data' => $school]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'motto' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_address' => 'nullable|string|max:255',
            'primary_color' => 'nullable|string|max:20',
            'secondary_color' => 'nullable|string|max:20',
            'currency' => 'nullable|string|max:10',
        ]);

        $school = School::findOrFail($id);
        $school->update($request->all());

        // Handle branding settings JSON if motto was sent separately but belongs in branding
        $branding = $school->branding ?? [];
        if ($request->has('motto')) {
            $branding['motto'] = $request->motto;
        }
        $school->branding = $branding;
        $school->save();

        return response()->json(['message' => 'School profile updated successfully.', 'data' => $school]);
    }
}
