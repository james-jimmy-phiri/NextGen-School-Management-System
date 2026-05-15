<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Stream;
use Illuminate\Http\Request;

class StreamController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $streams = Stream::where('school_id', $schoolId)->with('classGroup')->get();
        return response()->json(['data' => $streams]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_group_id' => 'required|exists:class_groups,id',
            'name' => 'required|string|max:255',
            'classroom' => 'nullable|string|max:100',
            'capacity' => 'nullable|integer|min:1',
        ]);

        $schoolId = $request->user()->school_id;

        $stream = Stream::create([
            'school_id' => $schoolId,
            'class_group_id' => $request->class_group_id,
            'name' => $request->name,
            'classroom' => $request->classroom,
            'capacity' => $request->capacity,
        ]);

        return response()->json(['message' => 'Stream created successfully.', 'data' => $stream], 201);
    }

    public function update(Request $request, $id)
    {
        $stream = Stream::findOrFail($id);
        
        $request->validate([
            'name' => 'string|max:255',
            'classroom' => 'nullable|string|max:100',
            'capacity' => 'nullable|integer|min:1',
        ]);

        $stream->update($request->all());

        return response()->json(['message' => 'Stream updated successfully.', 'data' => $stream]);
    }

    public function destroy($id)
    {
        $stream = Stream::findOrFail($id);
        $stream->delete();
        return response()->json(['message' => 'Stream deleted successfully.']);
    }
}
