<?php

namespace App\Support;

use App\Models\School;

class SchoolBranding
{
    /**
     * @return array<string, mixed>
     */
    public static function forSchool(?School $school): array
    {
        if (! $school) {
            return self::defaults();
        }

        $branding = is_array($school->branding) ? $school->branding : [];

        return [
            'id' => $school->id,
            'name' => $school->name,
            'slug' => $school->slug,
            'logo_url' => $school->logo_url,
            'primary_color' => $school->primary_color ?: '#1e40af',
            'secondary_color' => $school->secondary_color ?: '#0ea5e9',
            'motto' => $branding['motto'] ?? null,
            'address' => $school->address,
            'phone' => $school->phone,
            'email' => $school->email,
            'website' => $school->website,
            'city' => $school->city,
            'country' => $school->country,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function defaults(): array
    {
        return [
            'id' => null,
            'name' => 'Our School',
            'slug' => null,
            'logo_url' => null,
            'primary_color' => '#1e40af',
            'secondary_color' => '#0ea5e9',
            'motto' => 'Excellence in education',
            'address' => null,
            'phone' => null,
            'email' => null,
            'website' => null,
            'city' => null,
            'country' => null,
        ];
    }
}
