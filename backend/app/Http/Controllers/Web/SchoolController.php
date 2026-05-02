<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SchoolController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', School::class);

        /** @var \App\Models\User $user */
        $user = $request->user();

        $schools = School::query()
            ->when(! $user->isSuperAdmin(), fn ($query) => $query->whereKey($user->school_id))
            ->latest()
            ->paginate(12);

        return Inertia::render('Schools/Index', [
            'schools' => $schools,
        ]);
    }
}
