<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Student::class);

        /** @var \App\Models\User $user */
        $user = $request->user();

        $students = Student::query()
            ->with(['guardians', 'enrollments.classGroup'])
            ->when(! $user->isSuperAdmin(), fn ($query) => $query->where('school_id', $user->school_id))
            ->latest()
            ->paginate(15);

        return Inertia::render('Students/Index', [
            'students' => $students,
        ]);
    }
}
