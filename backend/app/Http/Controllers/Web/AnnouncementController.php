<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\ClassGroup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        abort_unless($request->user()->can('communication.manage'), 403);

        $schoolId = $request->user()->school_id;

        $announcements = Announcement::query()
            ->with('author:id,name')
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->orderByDesc('created_at')
            ->paginate(15);

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
        ]);
    }

    public function create(Request $request)
    {
        abort_unless($request->user()->can('communication.manage'), 403);
        $schoolId = $request->user()->school_id;

        return Inertia::render('Announcements/Create', [
            'classes' => ClassGroup::query()
                ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        abort_unless($request->user()->can('communication.manage'), 403);

        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'body' => 'required|string',
            'target' => 'required|string|in:all,teachers,parents,students,class',
            'target_class_id' => 'nullable|exists:class_groups,id',
            'publish_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:publish_at',
        ]);

        $audience = [
            'target' => $validated['target'],
            'class_id' => $validated['target_class_id'] ?? null,
        ];

        Announcement::create([
            'school_id' => $request->user()->school_id,
            'author_id' => $request->user()->id,
            'title' => $validated['title'],
            'body' => $validated['body'],
            'audience' => $audience,
            'delivery_channel' => 'in_app',
            'publish_at' => $validated['publish_at'] ?? now(),
            'expires_at' => $validated['expires_at'] ?? null,
        ]);

        return redirect()->route('announcements.index')->with('success', 'Announcement published.');
    }

    public function destroy(Request $request, Announcement $announcement)
    {
        abort_unless($request->user()->can('communication.manage'), 403);
        abort_unless($announcement->school_id === $request->user()->school_id, 403);

        $announcement->delete();

        return redirect()->back()->with('success', 'Announcement removed.');
    }
}
