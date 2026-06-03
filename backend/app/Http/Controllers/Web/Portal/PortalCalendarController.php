<?php

namespace App\Http\Controllers\Web\Portal;

use App\Http\Controllers\Controller;
use App\Models\SchoolCalendarEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalCalendarController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $events = SchoolCalendarEvent::where('school_id', $user->school_id)
            ->orderBy('start_date', 'asc')
            ->get();

        if ($events->isEmpty()) {
            $events = collect([
                ['id' => 1, 'title' => 'Mid-Term Break', 'start_date' => '2026-06-15', 'end_date' => '2026-06-19', 'event_type' => 'holiday', 'is_holiday' => true],
                ['id' => 2, 'title' => 'PTA Meeting', 'start_date' => '2026-06-25', 'end_date' => '2026-06-25', 'event_type' => 'meeting', 'is_holiday' => false],
                ['id' => 3, 'title' => 'End of Term Exams', 'start_date' => '2026-07-10', 'end_date' => '2026-07-24', 'event_type' => 'exam', 'is_holiday' => false],
            ]);
        }

        return Inertia::render('Portal/Calendar', [
            'events' => $events,
        ]);
    }
}
