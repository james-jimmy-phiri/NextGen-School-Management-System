<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSchoolRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\School::class);
    }

    public function rules(): array
    {
        return [
            // ── Core Identity ──────────────────────────────────────────────
            'name'                => ['required', 'string', 'max:255'],
            'short_name'          => ['nullable', 'string', 'max:30'],
            'slug'                => ['required', 'string', 'max:100', 'unique:schools,slug', 'regex:/^[a-z0-9\-]+$/'],
            'motto'               => ['nullable', 'string', 'max:255'],
            'registration_number' => ['nullable', 'string', 'max:100'],
            'school_type'         => ['nullable', 'string', 'in:Primary,Secondary,Combined,ECCD,Technical,University,Other'],
            'ownership'           => ['nullable', 'string', 'in:Private,Government,Mission,Community,NGO,International,Other'],
            'year_established'    => ['nullable', 'integer', 'min:1800', 'max:' . date('Y')],
            'education_level'     => ['nullable', 'string', 'max:100'],
            'logo'                => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:3072'],

            // ── Branding / System ──────────────────────────────────────────
            'timezone'            => ['nullable', 'string', 'max:60'],
            'locale'              => ['nullable', 'string', 'max:10'],
            'primary_color'       => ['nullable', 'string', 'max:50'],
            'secondary_color'     => ['nullable', 'string', 'max:50'],
            'currency'            => ['nullable', 'string', 'max:10'],
            'is_active'           => ['boolean'],

            // ── Contact ───────────────────────────────────────────────────
            'email'               => ['nullable', 'email', 'max:255'],
            'phone'               => ['nullable', 'string', 'max:30'],
            'alt_phone'           => ['nullable', 'string', 'max:30'],
            'website'             => ['nullable', 'url', 'max:255'],

            // ── Address ───────────────────────────────────────────────────
            'address'             => ['nullable', 'string', 'max:500'],
            'postal_address'      => ['nullable', 'string', 'max:255'],
            'city'                => ['nullable', 'string', 'max:100'],
            'district'            => ['nullable', 'string', 'max:100'],
            'region'              => ['nullable', 'string', 'max:100'],
            'country'             => ['nullable', 'string', 'max:100'],

            // ── GPS ───────────────────────────────────────────────────────
            'gps_lat'             => ['nullable', 'numeric', 'between:-90,90'],
            'gps_lng'             => ['nullable', 'numeric', 'between:-180,180'],

            // ── Leadership ───────────────────────────────────────────────
            'principal_name'          => ['nullable', 'string', 'max:150'],
            'deputy_principal_name'   => ['nullable', 'string', 'max:150'],
            'director_name'           => ['nullable', 'string', 'max:150'],
            'administrator_name'      => ['nullable', 'string', 'max:150'],
            'bursar_name'             => ['nullable', 'string', 'max:150'],
            'academic_director_name'  => ['nullable', 'string', 'max:150'],
        ];
    }

    public function messages(): array
    {
        return [
            'slug.regex'              => 'Slug may only contain lowercase letters, numbers, and hyphens.',
            'year_established.min'    => 'Year established cannot be before 1800.',
            'year_established.max'    => 'Year established cannot be in the future.',
            'gps_lat.between'         => 'Latitude must be between -90 and 90.',
            'gps_lng.between'         => 'Longitude must be between -180 and 180.',
        ];
    }
}
