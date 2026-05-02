<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SchoolResource;
use App\Models\School;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SchoolApiController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', School::class);

        $query = School::query()->latest();

        if (! $request->user()->isSuperAdmin()) {
            $query->whereKey($request->user()->school_id);
        }

        return SchoolResource::collection($query->paginate(25));
    }

    public function store(Request $request)
    {
        $this->authorize('create', School::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:190'],
            'timezone' => ['nullable', 'string', 'max:60'],
            'locale' => ['nullable', 'string', 'max:10'],
            'slug' => ['nullable', 'string', 'max:190', 'unique:schools,slug'],
            'branding' => ['nullable', 'array'],
            'settings' => ['nullable', 'array'],
        ]);

        $slug = $validated['slug'] ?? Str::slug($validated['name']).'-'.Str::random(4);

        $school = School::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'timezone' => $validated['timezone'] ?? 'Africa/Lagos',
            'locale' => $validated['locale'] ?? 'en',
            'branding' => $validated['branding'] ?? null,
            'settings' => $validated['settings'] ?? null,
        ]);

        return ApiResponse::success(SchoolResource::make($school), message: __('School created'), status: 201);
    }

    public function update(Request $request, School $school)
    {
        $this->authorize('update', $school);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:190'],
            'timezone' => ['sometimes', 'string', 'max:60'],
            'locale' => ['sometimes', 'string', 'max:10'],
            'branding' => ['sometimes', 'array'],
            'settings' => ['sometimes', 'array'],
            'logo_path' => ['sometimes', 'nullable', 'string'],
        ]);

        $school->update($validated);

        return ApiResponse::success(SchoolResource::make($school->fresh()), message: __('School updated'));
    }
}
