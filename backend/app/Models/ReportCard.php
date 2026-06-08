<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportCard extends Model
{
    protected $fillable = [
        'school_id',
        'student_id',
        'academic_year_id',
        'term_id',
        'gpa',
        'rank',
        'summary',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'gpa' => 'decimal:2',
            'summary' => 'array',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function term(): BelongsTo
    {
        return $this->belongsTo(Term::class);
    }
}
