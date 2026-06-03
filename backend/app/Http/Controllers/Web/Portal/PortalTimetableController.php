<?php

namespace App\Http\Controllers\Web\Portal;

use App\Http\Controllers\Concerns\AuthorizesPortalStudent;
use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalTimetableController extends Controller
{
    use AuthorizesPortalStudent;

    public function show(Request $request, Student $student): Response
    {
        $this->authorizePortalStudent($request, $student);

        $student->load(['school', 'enrollments.classGroup']);

        $enrollment = $student->enrollments()->latest()->first();
        $classGroupId = $enrollment ? $enrollment->class_group_id : null;

        $timetablePeriods = collect();
        if ($classGroupId) {
            $timetablePeriods = \App\Models\TimetablePeriod::with(['subject', 'teacher'])
                ->where('class_group_id', $classGroupId)
                ->orderBy('start_time')
                ->get();
        }

        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        
        $uniqueTimes = $timetablePeriods->map(function ($p) {
            return [
                'start_time' => \Carbon\Carbon::parse($p->start_time)->format('H:i'),
                'end_time' => \Carbon\Carbon::parse($p->end_time)->format('H:i'),
                'is_break' => $p->is_break,
                'name' => $p->name,
            ];
        })->unique(function ($item) {
            return $item['start_time'] . '-' . $item['end_time'];
        })->sortBy('start_time')->values();

        $periods = $uniqueTimes->map(function ($time, $index) {
            return [
                'id' => $index + 1,
                'time' => $time['start_time'] . ' - ' . $time['end_time'],
                'is_break' => $time['is_break'],
                'name' => $time['name'] ?? null,
                'start_time' => $time['start_time'],
                'end_time' => $time['end_time'],
            ];
        })->all();

        $schedule = [];
        foreach ($days as $day) {
            $schedule[$day] = [];
            foreach ($periods as $period) {
                if ($period['is_break']) {
                    continue;
                }
                
                $matchingPeriod = $timetablePeriods->first(function ($p) use ($day, $period) {
                    return $p->day_of_week === $day && 
                           \Carbon\Carbon::parse($p->start_time)->format('H:i') === $period['start_time'] &&
                           \Carbon\Carbon::parse($p->end_time)->format('H:i') === $period['end_time'];
                });

                if ($matchingPeriod) {
                    $schedule[$day][$period['id']] = [
                        'subject' => $matchingPeriod->subject ? $matchingPeriod->subject->name : '-',
                        'teacher' => $matchingPeriod->teacher ? trim($matchingPeriod->teacher->first_name . ' ' . $matchingPeriod->teacher->last_name) : '-',
                        'room' => $matchingPeriod->room ?? '-',
                    ];
                }
            }
        }

        return Inertia::render('Portal/Child/Timetable', [
            'student' => $student,
            'days' => $days,
            'periods' => $periods,
            'schedule' => $schedule,
        ]);
    }
}
