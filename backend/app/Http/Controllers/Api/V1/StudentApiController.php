<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class StudentApiController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Student::class);

        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
        ]);

        $query = Student::query()
            ->with(['guardians', 'enrollments.classGroup'])
            ->latest();

        if (! $request->user()->isSuperAdmin()) {
            $query->where('school_id', $request->user()->school_id);
        }

        if (! empty($validated['search'])) {
            $term = $validated['search'];
            $query->where(function ($builder) use ($term) {
                $builder
                    ->where('first_name', 'like', "%{$term}%")
                    ->orWhere('last_name', 'like', "%{$term}%")
                    ->orWhere('admission_number', 'like', "%{$term}%");
            });
        }

        return StudentResource::collection($query->paginate(25));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Student::class);

        $validated = $request->validate([
            'school_id' => ['required', 'exists:schools,id'],
            'admission_number' => ['required', 'string', 'max:40'],
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'gender' => ['nullable', 'string', 'max:20'],
            'date_of_birth' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'max:30'],
            'medical_notes' => ['nullable', 'string'],
        ]);

        if (! $request->user()->isSuperAdmin() && (int) $validated['school_id'] !== (int) $request->user()->school_id) {
            abort(403, __('Cross-tenant provisioning is not permitted.'));
        }

        $student = Student::create($validated)->load(['guardians', 'enrollments.classGroup']);

        return ApiResponse::success(StudentResource::make($student), message: __('Student admitted'), status: 201);
    }

    public function show(Request $request, Student $student)
    {
        $this->authorize('view', $student);

        return ApiResponse::success(
            StudentResource::make($student->loadMissing(['guardians', 'enrollments.classGroup', 'school']))
        );
    }
}
