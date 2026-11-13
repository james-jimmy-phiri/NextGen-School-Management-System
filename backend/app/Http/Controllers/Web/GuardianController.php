<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Guardian;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuardianController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $guardians = Guardian::query()
            ->with(['students:id,first_name,last_name,admission_number', 'portalUser:id,name,email'])
            ->when($schoolId, fn ($q) => $q->where('school_id', $schoolId))
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = '%' . $request->string('search') . '%';
                $q->where(function ($inner) use ($search) {
                    $inner->where('first_name', 'like', $search)
                        ->orWhere('last_name', 'like', $search)
                        ->orWhere('email', 'like', $search)
                        ->orWhere('phone', 'like', $search);
                });
            })
            ->orderBy('first_name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Guardians/Index', [
            'guardians' => $guardians,
            'filters' => $request->only(['search']),
        ]);
    }

    public function verify(Request $request, Guardian $guardian)
    {
        abort_unless($request->user()->school_id === $guardian->school_id || $request->user()->isSuperAdmin(), 403);

        $guardian->update([
            'verified_at' => now(),
            'verified_by' => $request->user()->id,
        ]);

        if ($guardian->portalUser) {
            $guardian->portalUser->update(['status' => 'active']);
        }

        activity('guardian')->causedBy($request->user())->performedOn($guardian)->log('Verified guardian relationship');

        return back()->with('success', 'Guardian verified. Portal access is now enabled.');
    }
}
