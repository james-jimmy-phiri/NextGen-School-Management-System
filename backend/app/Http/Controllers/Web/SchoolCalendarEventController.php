<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\SchoolCalendarEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolCalendarEventController extends Controller
{
    public function index(Request $request)
    {
        abort_unless($request->user()->can('school_setup.view'), 403);

        $schoolId = $request->user()->school_id;

        $events = SchoolCalendarEvent::query()
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->orderBy('start_date')
            ->paginate(20);

        return Inertia::render('Calendar/Index', [
            'events' => $events,
        ]);
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->can('school_setup.view'), 403);

        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'event_type' => 'required|string|in:holiday,exam,meeting,sports,other',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_holiday' => 'boolean',
        ]);

        SchoolCalendarEvent::create([
            'school_id' => $request->user()->school_id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'event_type' => $validated['event_type'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? $validated['start_date'],
            'is_holiday' => $validated['is_holiday'] ?? false,
        ]);

        return redirect()->back()->with('success', 'Calendar event added.');
    }

    public function destroy(Request $request, SchoolCalendarEvent $event)
    {
        abort_unless($request->user()->can('school_setup.view'), 403);
        abort_unless($event->school_id === $request->user()->school_id, 403);

        $event->delete();

        return redirect()->back()->with('success', 'Event removed.');
    }
}
