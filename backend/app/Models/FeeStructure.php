<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'academic_year_id',
        'name',
        'description',
        'components',
        'allow_installments',
        'penalty_percent',
        'discount_percent',
    ];

    protected function casts(): array
    {
        return [
            'components' => 'array',
            'allow_installments' => 'boolean',
            'penalty_percent' => 'decimal:2',
            'discount_percent' => 'decimal:2',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
