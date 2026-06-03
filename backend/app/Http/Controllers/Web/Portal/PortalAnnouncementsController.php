<?php

namespace App\Http\Controllers\Web\Portal;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalAnnouncementsController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $announcements = Announcement::where('school_id', $user->school_id)
            ->with('author:id,name')
            ->latest('publish_at')
            ->get();

        return Inertia::render('Portal/Announcements', [
            'announcements' => $announcements,
        ]);
    }
}
