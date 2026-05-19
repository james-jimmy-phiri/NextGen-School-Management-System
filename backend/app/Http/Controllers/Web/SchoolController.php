<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSchoolRequest;
use App\Http\Requests\UpdateSchoolRequest;
use App\Models\School;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class SchoolController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', School::class);

        /** @var \App\Models\User $user */
        $user = $request->user();

        if (! $user->isSuperAdmin()) {
            $school = School::with(['academicYears', 'departments'])->findOrFail($user->school_id);
            $currentAcademicYear = $school->academicYears->where('is_current', true)->first();

            return Inertia::render('Schools/Profile', [
                'school' => $school,
                'currentAcademicYear' => $currentAcademicYear,
                'departments' => $school->departments,
            ]);
        }

        $schools = School::query()
            ->latest()
            ->paginate(15);

        return Inertia::render('Schools/Index', [
            'schools' => $schools,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', School::class);

        return Inertia::render('Schools/Create');
    }

    public function store(StoreSchoolRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            $validated['logo_path'] = $request->file('logo')->store('logos', 'public');
        }

        School::create($validated);

        return redirect()->route('schools.index')->with('success', 'School created successfully.');
    }

    public function edit(School $school): Response
    {
        $this->authorize('update', $school);

        return Inertia::render('Schools/Edit', [
            'school' => $school,
        ]);
    }

    public function update(UpdateSchoolRequest $request, School $school): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            if ($school->logo_path) {
                Storage::disk('public')->delete($school->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('logos', 'public');
        }

        $school->update($validated);

        return redirect()->route('schools.index')->with('success', 'School updated successfully.');
    }

    public function destroy(School $school): RedirectResponse
    {
        $this->authorize('delete', $school);

        // Check for related records to prevent orphaned data or DB constraint errors
        $hasUsers = $school->users()->exists();
        $hasStudents = $school->students()->exists();
        $hasCampuses = $school->campuses()->exists();

        if ($hasUsers || $hasStudents || $hasCampuses) {
            return redirect()->back()->with('error', 'Cannot delete school because it has connected users, students, or campuses.');
        }

        $school->delete();

        return redirect()->route('schools.index')->with('success', 'School deleted successfully.');
    }
}
