<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchoolCalendarEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'title',
        'description',
        'event_type',
        'start_date',
        'end_date',
        'is_holiday',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_holiday' => 'boolean',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
