<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentTransfer extends Model
{
    protected $fillable = [
        'school_id',
        'student_id',
        'direction',
        'reason',
        'effective_on',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'effective_on' => 'date',
            'meta' => 'array',
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
}
