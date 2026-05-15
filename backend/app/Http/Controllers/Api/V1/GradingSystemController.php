<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\GradingSystem;
use App\Models\GradingScale;
use Illuminate\Http\Request;

class GradingSystemController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $systems = GradingSystem::where('school_id', $schoolId)->with('scales')->get();
        return response()->json(['data' => $systems]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:gpa,percentage,custom',
            'is_default' => 'boolean',
            'scales' => 'nullable|array',
            'scales.*.min_score' => 'required_with:scales|numeric|min:0',
            'scales.*.max_score' => 'required_with:scales|numeric|min:0',
            'scales.*.grade' => 'required_with:scales|string|max:10',
            'scales.*.remark' => 'nullable|string|max:255',
            'scales.*.points' => 'nullable|numeric|min:0',
        ]);

        $schoolId = $request->user()->school_id;

        if ($request->is_default) {
            GradingSystem::where('school_id', $schoolId)->update(['is_default' => false]);
        }

        $system = GradingSystem::create([
            'school_id' => $schoolId,
            'name' => $request->name,
            'type' => $request->type,
            'is_default' => $request->is_default ?? false,
        ]);

        if ($request->has('scales')) {
            foreach ($request->scales as $scale) {
                GradingScale::create([
                    'grading_system_id' => $system->id,
                    'min_score' => $scale['min_score'],
                    'max_score' => $scale['max_score'],
                    'grade' => $scale['grade'],
                    'remark' => $scale['remark'] ?? null,
                    'points' => $scale['points'] ?? 0,
                ]);
            }
        }

        return response()->json(['message' => 'Grading system created successfully.', 'data' => $system->load('scales')], 201);
    }

    public function update(Request $request, $id)
    {
        $system = GradingSystem::findOrFail($id);
        
        $request->validate([
            'name' => 'string|max:255',
            'type' => 'string|in:gpa,percentage,custom',
            'is_default' => 'boolean',
            'scales' => 'nullable|array',
            'scales.*.id' => 'nullable|exists:grading_scales,id',
            'scales.*.min_score' => 'required_with:scales|numeric|min:0',
            'scales.*.max_score' => 'required_with:scales|numeric|min:0',
            'scales.*.grade' => 'required_with:scales|string|max:10',
            'scales.*.remark' => 'nullable|string|max:255',
            'scales.*.points' => 'nullable|numeric|min:0',
        ]);

        if ($request->is_default) {
            GradingSystem::where('school_id', $system->school_id)->where('id', '!=', $id)->update(['is_default' => false]);
        }

        $system->update($request->only(['name', 'type', 'is_default']));

        if ($request->has('scales')) {
            // Very simple replacement or update logic for scales
            // For production, a more robust sync is better, but this works for basic REST
            $existingIds = collect($request->scales)->pluck('id')->filter()->all();
            GradingScale::where('grading_system_id', $system->id)->whereNotIn('id', $existingIds)->delete();

            foreach ($request->scales as $scale) {
                if (isset($scale['id'])) {
                    GradingScale::where('id', $scale['id'])->update([
                        'min_score' => $scale['min_score'],
                        'max_score' => $scale['max_score'],
                        'grade' => $scale['grade'],
                        'remark' => $scale['remark'] ?? null,
                        'points' => $scale['points'] ?? 0,
                    ]);
                } else {
                    GradingScale::create([
                        'grading_system_id' => $system->id,
                        'min_score' => $scale['min_score'],
                        'max_score' => $scale['max_score'],
                        'grade' => $scale['grade'],
                        'remark' => $scale['remark'] ?? null,
                        'points' => $scale['points'] ?? 0,
                    ]);
                }
            }
        }

        return response()->json(['message' => 'Grading system updated successfully.', 'data' => $system->load('scales')]);
    }

    public function destroy($id)
    {
        $system = GradingSystem::findOrFail($id);
        $system->delete();
        return response()->json(['message' => 'Grading system deleted successfully.']);
    }
}
