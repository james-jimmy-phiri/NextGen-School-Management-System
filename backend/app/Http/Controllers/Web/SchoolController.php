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
        School::create($request->validated());

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
        $school->update($request->validated());

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
