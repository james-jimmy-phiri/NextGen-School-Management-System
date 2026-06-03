<?php

namespace App\Http\Controllers\Web\Portal;

use App\Http\Controllers\Controller;
use App\Models\PortalMessage;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalMessagesController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get messages where user is sender or recipient
        $messages = PortalMessage::where('school_id', $user->school_id)
            ->where(function($q) use ($user) {
                $q->where('to_user_id', $user->id)
                  ->orWhere('from_user_id', $user->id);
            })
            ->with(['sender:id,name', 'recipient:id,name', 'student:id,first_name,last_name'])
            ->latest()
            ->get();

        // Demo contacts for new message
        $contacts = User::where('school_id', $user->school_id)
            ->whereHas('roles', function($q) {
                $q->whereIn('name', ['school_admin', 'teacher', 'accountant']);
            })
            ->select('id', 'name')
            ->get()
            ->map(function($u) {
                return ['id' => $u->id, 'name' => $u->name, 'role' => 'Staff']; // Simplified role for demo
            });

        $messages = $messages->map(function ($m) use ($user) {
            $m->is_sender = $m->from_user_id === $user->id;

            return $m;
        });

        return Inertia::render('Portal/Messages', [
            'messages' => $messages,
            'contacts' => $contacts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'to_user_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'student_id' => 'nullable|exists:students,id',
        ]);

        $recipient = User::where('id', $validated['to_user_id'])
            ->where('school_id', $request->user()->school_id)
            ->firstOrFail();

        if (! $recipient->hasAnyRole(['school_admin', 'teacher', 'accountant', 'registrar'])) {
            abort(403, 'Invalid message recipient.');
        }

        if (! empty($validated['student_id'])) {
            $ownsStudent = Student::query()
                ->where('id', $validated['student_id'])
                ->whereHas('guardians', fn ($q) => $q->where('user_id', $request->user()->id))
                ->exists();

            if (! $ownsStudent) {
                abort(403, 'Invalid student reference.');
            }
        }

        PortalMessage::create([
            'school_id' => $request->user()->school_id,
            'from_user_id' => $request->user()->id,
            'to_user_id' => $validated['to_user_id'],
            'student_id' => $validated['student_id'] ?? null,
            'subject' => $validated['subject'],
            'body' => $validated['body'],
        ]);

        return redirect()->back()->with('success', 'Message sent successfully.');
    }
}
