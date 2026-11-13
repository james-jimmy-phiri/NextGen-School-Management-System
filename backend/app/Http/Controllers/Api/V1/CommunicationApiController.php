<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\PortalMessage;
use App\Models\SchoolCalendarEvent;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunicationApiController extends Controller
{
    /**
     * Get published school announcements targeted for the user's role.
     */
    public function announcements(Request $request): JsonResponse
    {
        $user = $request->user();
        $schoolId = $user->school_id;

        $query = Announcement::query()
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->with('author:id,name')
            ->latest('id');

        $announcements = $query->take(20)->get()->map(function ($a) {
            $isUrgent = str_contains(strtolower($a->title), 'urgent') ||
                        str_contains(strtolower($a->body), 'urgent') ||
                        str_contains(strtolower($a->title), 'emergency');

            return [
                'id' => $a->id,
                'title' => $a->title,
                'body' => $a->body,
                'audience' => $a->audience ?? ['all'],
                'author_name' => $a->author?->name ?? 'School Administration',
                'delivery_channel' => $a->delivery_channel ?? 'portal',
                'is_urgent' => $isUrgent,
                'created_at' => $a->created_at->toIso8601String(),
                'date_formatted' => $a->created_at->format('d M Y, h:i A'),
            ];
        });

        // Provide realistic demo announcements if empty
        if ($announcements->isEmpty()) {
            $announcements = collect([
                [
                    'id' => 1,
                    'title' => 'Term II Mid-Term Break Schedule',
                    'body' => 'Please note that the mid-term break will commence on Friday, 13 November at 12:30 PM. Classes resume on Monday, 23 November at 07:30 AM.',
                    'audience' => ['parents', 'staff', 'students'],
                    'author_name' => 'Principal Office',
                    'delivery_channel' => 'portal',
                    'is_urgent' => false,
                    'created_at' => now()->subDays(2)->toIso8601String(),
                    'date_formatted' => now()->subDays(2)->format('d M Y, h:i A'),
                ],
                [
                    'id' => 2,
                    'title' => 'Annual Parent-Teacher Academic Conference',
                    'body' => 'All guardians are warmly invited to attend the Form 1–4 academic progress conference this Saturday starting at 09:00 AM in the Main Assembly Hall.',
                    'audience' => ['parents'],
                    'author_name' => 'Academic Director',
                    'delivery_channel' => 'portal',
                    'is_urgent' => false,
                    'created_at' => now()->subDays(5)->toIso8601String(),
                    'date_formatted' => now()->subDays(5)->format('d M Y, h:i A'),
                ],
                [
                    'id' => 3,
                    'title' => 'Urgent: Term II Fee Settlement Notice',
                    'body' => 'Guardians with outstanding tuition balances are kindly requested to settle balances before the start of the end-of-term examinations.',
                    'audience' => ['parents'],
                    'author_name' => 'Accounts & Bursar',
                    'delivery_channel' => 'portal',
                    'is_urgent' => true,
                    'created_at' => now()->subDays(7)->toIso8601String(),
                    'date_formatted' => now()->subDays(7)->format('d M Y, h:i A'),
                ],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $announcements,
        ]);
    }

    /**
     * Get school calendar events and holidays.
     */
    public function events(Request $request): JsonResponse
    {
        $user = $request->user();
        $schoolId = $user->school_id;

        $events = SchoolCalendarEvent::query()
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->orderBy('start_date')
            ->take(30)
            ->get()
            ->map(function ($e) {
                return [
                    'id' => $e->id,
                    'title' => $e->title,
                    'description' => $e->description,
                    'event_type' => $e->event_type ?? 'academic',
                    'start_date' => $e->start_date?->format('Y-m-d'),
                    'end_date' => $e->end_date?->format('Y-m-d') ?? $e->start_date?->format('Y-m-d'),
                    'is_holiday' => (bool) $e->is_holiday,
                ];
            });

        if ($events->isEmpty()) {
            $events = collect([
                [
                    'id' => 1,
                    'title' => 'Form 4 Mock Examinations',
                    'description' => 'National curriculum mock preparation tests across all science and arts subjects.',
                    'event_type' => 'exam',
                    'start_date' => now()->addDays(4)->format('Y-m-d'),
                    'end_date' => now()->addDays(9)->format('Y-m-d'),
                    'is_holiday' => false,
                ],
                [
                    'id' => 2,
                    'title' => 'Inter-Schools Athletics Tournament',
                    'description' => 'Regional secondary schools track and field tournament at Lilongwe Stadium.',
                    'event_type' => 'sports',
                    'start_date' => now()->addDays(14)->format('Y-m-d'),
                    'end_date' => now()->addDays(15)->format('Y-m-d'),
                    'is_holiday' => false,
                ],
                [
                    'id' => 3,
                    'title' => 'Mid-Term Public Holiday',
                    'description' => 'School closed for national public holiday.',
                    'event_type' => 'holiday',
                    'start_date' => now()->addDays(20)->format('Y-m-d'),
                    'end_date' => now()->addDays(20)->format('Y-m-d'),
                    'is_holiday' => true,
                ],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    /**
     * Get 1-on-1 portal message threads for the user.
     */
    public function messages(Request $request): JsonResponse
    {
        $user = $request->user();

        $messages = PortalMessage::query()
            ->where(function ($q) use ($user) {
                $q->where('to_user_id', $user->id)
                  ->orWhere('from_user_id', $user->id);
            })
            ->with(['sender:id,name', 'recipient:id,name', 'student:id,first_name,last_name'])
            ->latest('id')
            ->take(50)
            ->get()
            ->map(function ($m) use ($user) {
                $isSender = $m->from_user_id === $user->id;
                $otherUser = $isSender ? $m->recipient : $m->sender;

                return [
                    'id' => $m->id,
                    'from_user_id' => $m->from_user_id,
                    'sender_name' => $m->sender?->name ?? 'Staff Member',
                    'to_user_id' => $m->to_user_id,
                    'recipient_name' => $m->recipient?->name ?? 'Guardian',
                    'contact_name' => $otherUser?->name ?? 'School Contact',
                    'student_name' => $m->student ? "{$m->student->first_name} {$m->student->last_name}" : null,
                    'subject' => $m->subject,
                    'body' => $m->body,
                    'is_sender' => $isSender,
                    'is_read' => $m->read_at !== null,
                    'read_at' => $m->read_at?->toIso8601String(),
                    'created_at' => $m->created_at->toIso8601String(),
                    'date_formatted' => $m->created_at->diffForHumans(),
                ];
            });

        // Provide demo sample messages if empty
        if ($messages->isEmpty()) {
            $messages = collect([
                [
                    'id' => 1,
                    'from_user_id' => 999,
                    'sender_name' => 'Mr. Chisomo Banda (Class Teacher)',
                    'to_user_id' => $user->id,
                    'recipient_name' => $user->name,
                    'contact_name' => 'Mr. Chisomo Banda (Class Teacher)',
                    'student_name' => 'Thandiwe Banda',
                    'subject' => 'Commendable Mathematics Progress',
                    'body' => 'Good day. I wanted to commend Thandiwe on her outstanding score in the recent algebra assessment. She demonstrated strong conceptual problem solving.',
                    'is_sender' => false,
                    'is_read' => true,
                    'read_at' => now()->subHours(2)->toIso8601String(),
                    'created_at' => now()->subHours(4)->toIso8601String(),
                    'date_formatted' => '4 hours ago',
                ],
                [
                    'id' => 2,
                    'from_user_id' => $user->id,
                    'sender_name' => $user->name,
                    'to_user_id' => 998,
                    'recipient_name' => 'Mrs. Thandiwe Phiri (Accounts Bursar)',
                    'contact_name' => 'Mrs. Thandiwe Phiri (Accounts Bursar)',
                    'student_name' => 'Thandiwe Banda',
                    'subject' => 'Airtel Money Fee Receipt Confirmation',
                    'body' => 'Dear Bursar, I have processed the tuition instalment of MWK 150,000 via Airtel Money ref TXN-AM-8923019. Kindly confirm receipt.',
                    'is_sender' => true,
                    'is_read' => true,
                    'read_at' => now()->subDays(1)->toIso8601String(),
                    'created_at' => now()->subDays(1)->toIso8601String(),
                    'date_formatted' => '1 day ago',
                ],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    /**
     * Send a 1-on-1 portal message.
     */
    public function sendMessage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'to_user_id' => ['required', 'exists:users,id'],
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'student_id' => ['nullable', 'exists:students,id'],
        ]);

        $message = PortalMessage::create([
            'school_id' => $request->user()->school_id,
            'from_user_id' => $request->user()->id,
            'to_user_id' => $validated['to_user_id'],
            'student_id' => $validated['student_id'] ?? null,
            'subject' => $validated['subject'],
            'body' => $validated['body'],
        ])->load(['sender:id,name', 'recipient:id,name']);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully.',
            'data' => [
                'id' => $message->id,
                'from_user_id' => $message->from_user_id,
                'sender_name' => $message->sender?->name,
                'to_user_id' => $message->to_user_id,
                'recipient_name' => $message->recipient?->name,
                'subject' => $message->subject,
                'body' => $message->body,
                'created_at' => $message->created_at->toIso8601String(),
                'date_formatted' => 'Just now',
            ],
        ], 201);
    }

    /**
     * List messageable contacts for the user.
     */
    public function contacts(Request $request): JsonResponse
    {
        $user = $request->user();
        $schoolId = $user->school_id;

        // If user is a parent, contacts are teachers and school admins
        if ($user->hasRole('parent')) {
            $contacts = User::query()
                ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
                ->whereHas('roles', fn ($q) => $q->whereIn('name', ['teacher', 'school_admin', 'accountant', 'school_director']))
                ->select('id', 'name', 'email')
                ->get()
                ->map(function ($u) {
                    return [
                        'id' => $u->id,
                        'name' => $u->name,
                        'email' => $u->email,
                        'role' => $u->roles->first()?->name ?? 'Staff',
                    ];
                });
        } else {
            // If teacher or staff, contacts can be parents of students in the school
            $contacts = User::query()
                ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
                ->whereHas('roles', fn ($q) => $q->where('name', 'parent'))
                ->select('id', 'name', 'email')
                ->take(30)
                ->get()
                ->map(function ($u) {
                    return [
                        'id' => $u->id,
                        'name' => $u->name,
                        'email' => $u->email,
                        'role' => 'Guardian',
                    ];
                });
        }

        // Demo fallback contacts
        if ($contacts->isEmpty()) {
            $contacts = collect([
                ['id' => 3, 'name' => 'Chisomo Banda', 'email' => 'teacher@horizon.demo', 'role' => 'Class Teacher (Form 3)'],
                ['id' => 2, 'name' => 'Thandiwe Phiri', 'email' => 'admin@horizon.demo', 'role' => 'School Administrator'],
                ['id' => 4, 'name' => 'Kondwani Mwale', 'email' => 'finance@horizon.demo', 'role' => 'Accounts & Bursar'],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $contacts,
        ]);
    }

    /**
     * Mark message as read.
     */
    public function markAsRead(Request $request, PortalMessage $message): JsonResponse
    {
        if ($message->to_user_id === $request->user()->id && ! $message->read_at) {
            $message->update(['read_at' => now()]);
        }

        return response()->json(['success' => true]);
    }
}

