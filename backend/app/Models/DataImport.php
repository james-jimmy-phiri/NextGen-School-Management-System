<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DataImport extends Model
{
    protected $fillable = [
        'school_id',
        'user_id',
        'type',
        'status',
        'original_filename',
        'rows',
        'errors',
        'committed_count',
        'committed_at',
    ];

    protected function casts(): array
    {
        return [
            'rows' => 'array',
            'errors' => 'array',
            'committed_at' => 'datetime',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
