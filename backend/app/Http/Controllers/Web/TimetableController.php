<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\TimetablePeriod;
use App\Models\ClassGroup;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TimetableController extends Controller
{
    public function index(Request $request)
    {
        $classGroupId = $request->query('class_group_id');

        $query = TimetablePeriod::with(['classGroup.gradeLevel', 'subject', 'teacher'])
            ->when($classGroupId, function ($q) use ($classGroupId) {
                $q->where('class_group_id', $classGroupId);
            })
            ->orderBy('day_of_week')
            ->orderBy('start_time');

        $periods = $query->paginate(15)->withQueryString();

        $classGroups = ClassGroup::with('gradeLevel')->get();
        $subjects = Subject::all();
        $teachers = User::role('teacher')->get();

        return Inertia::render('Timetable/Index', [
            'periods' => $periods,
            'classGroups' => $classGroups,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'filters' => $request->only(['class_group_id']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_group_id' => 'required|exists:class_groups,id',
            'day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_break' => 'boolean',
            'name' => 'nullable|string|max:255',
            'subject_id' => 'nullable|exists:subjects,id',
            'teacher_id' => 'nullable|exists:users,id',
            'room' => 'nullable|string|max:255',
        ]);

        TimetablePeriod::create($validated);

        return redirect()->back()->with('success', 'Timetable period created successfully.');
    }

    public function update(Request $request, TimetablePeriod $timetable)
    {
        $validated = $request->validate([
            'class_group_id' => 'required|exists:class_groups,id',
            'day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_break' => 'boolean',
            'name' => 'nullable|string|max:255',
            'subject_id' => 'nullable|exists:subjects,id',
            'teacher_id' => 'nullable|exists:users,id',
            'room' => 'nullable|string|max:255',
        ]);

        $timetable->update($validated);

        return redirect()->back()->with('success', 'Timetable period updated successfully.');
    }

    public function destroy(TimetablePeriod $timetable)
    {
        $timetable->delete();

        return redirect()->back()->with('success', 'Timetable period deleted successfully.');
    }
}
