<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'author_id',
        'title',
        'body',
        'audience',
        'delivery_channel',
        'publish_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'audience' => 'array',
            'publish_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
