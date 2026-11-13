<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class School extends Model
{
    use HasFactory, SoftDeletes;

    protected $appends = ['logo_url'];

    protected $fillable = [
        // Core identity
        'name',
        'short_name',
        'slug',
        'motto',
        'registration_number',
        'school_type',
        'ownership',
        'year_established',
        'education_level',

        // Branding / System
        'timezone',
        'locale',
        'branding',
        'settings',
        'logo_path',
        'primary_color',
        'secondary_color',
        'currency',
        'is_active',

        // Contact
        'email',
        'phone',
        'alt_phone',
        'website',

        // Address
        'address',
        'postal_address',
        'city',
        'district',
        'region',
        'country',

        // GPS
        'gps_lat',
        'gps_lng',

        // Leadership
        'principal_name',
        'deputy_principal_name',
        'director_name',
        'administrator_name',
        'bursar_name',
        'academic_director_name',

        // UUID (public route key)
        'uuid',
    ];

    protected function casts(): array
    {
        return [
            'branding'          => 'array',
            'settings'          => 'array',
            'is_active'         => 'boolean',
            'gps_lat'           => 'decimal:7',
            'gps_lng'           => 'decimal:7',
            'year_established'  => 'integer',
        ];
    }

    // ── Auto-generate UUID on create ────────────────────────────────────────
    protected static function booted(): void
    {
        static::creating(function (School $school) {
            if (empty($school->uuid)) {
                $school->uuid = (string) Str::uuid();
            }
        });
    }

    // ── Route model binding: use UUID for public URLs ────────────────────────
    public function getRouteKeyName(): string
    {
        // This makes route('schools.edit', $school) resolve via UUID, not integer ID.
        // Super-admin index still uses integer internally (via ->find($id)), 
        // but all web URLs use the UUID.
        return 'uuid';
    }

    // ── Relationships ────────────────────────────────────────────────────────
    public function campuses(): HasMany
    {
        return $this->hasMany(Campus::class);
    }

    public function academicYears(): HasMany
    {
        return $this->hasMany(AcademicYear::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    // ── Computed Attributes ──────────────────────────────────────────────────
    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo_path ? asset('storage/' . $this->logo_path) : null;
    }

    /**
     * Generate a human-readable institutional school code, e.g. SCH-0001
     * Used for display on directories and reports.
     */
    public function getSchoolCodeAttribute(): string
    {
        return 'SCH-' . str_pad((string) $this->id, 4, '0', STR_PAD_LEFT);
    }
}
