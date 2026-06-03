<?php

namespace App\Http\Controllers\Web\Portal;

use App\Http\Controllers\Controller;
use App\Models\Guardian;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalProfileController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user();
        $user->load('guardians');

        return Inertia::render('Portal/Profile', [
            'profile' => $user,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
        ]);

        $user->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? $user->phone,
        ]);

        $guardian = Guardian::query()
            ->where('user_id', $user->id)
            ->where('school_id', $user->school_id)
            ->first();

        if ($guardian) {
            $guardian->update([
                'phone' => $validated['phone'] ?? $guardian->phone,
                'address' => $validated['address'] ?? $guardian->address,
            ]);
        }

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }
}
