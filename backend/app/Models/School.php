<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    use HasFactory, SoftDeletes;

    protected $appends = ['logo_url'];

    protected $fillable = [
        'name',
        'slug',
        'timezone',
        'locale',
        'branding',
        'settings',
        'logo_path',
        'is_active',
        'address',
        'phone',
        'email',
        'website',
        'city',
        'country',
        'postal_address',
        'primary_color',
        'secondary_color',
        'currency',
    ];

    protected function casts(): array
    {
        return [
            'branding' => 'array',
            'settings' => 'array',
            'is_active' => 'boolean',
        ];
    }

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

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo_path ? asset('storage/' . $this->logo_path) : null;
    }
}
