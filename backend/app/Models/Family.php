<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Family extends Model
{
    protected $fillable = [
        'school_id',
        'name',
        'payer_guardian_id',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function payer(): BelongsTo
    {
        return $this->belongsTo(Guardian::class, 'payer_guardian_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}
