<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentSequence extends Model
{
    public const TYPE_ADMISSION = 'admission';

    public const TYPE_INVOICE = 'invoice';

    public const TYPE_RECEIPT = 'receipt';

    public const TYPE_APPLICATION = 'application';

    protected $fillable = [
        'school_id',
        'document_type',
        'prefix',
        'include_year',
        'padding',
        'next_number',
    ];

    protected function casts(): array
    {
        return [
            'include_year' => 'boolean',
            'padding' => 'integer',
            'next_number' => 'integer',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
