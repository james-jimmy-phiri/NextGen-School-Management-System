<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class BookBorrowing extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $fillable = [
        'school_id',
        'book_id',
        'borrower_type',
        'borrower_id',
        'issued_by',
        'issued_on',
        'due_on',
        'returned_on',
        'fine_amount',
        'fine_paid',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'borrower_id' => 'integer',
            'issued_on' => 'date',
            'due_on' => 'date',
            'returned_on' => 'date',
            'fine_amount' => 'decimal:2',
            'fine_paid' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::created(function (BookBorrowing $borrowing) {
            $borrowing->book()->decrement('available_copies');
        });

        static::updated(function (BookBorrowing $borrowing) {
            // If the returned_on date is newly set (was null, now not null), increment available_copies
            if ($borrowing->wasChanged('returned_on') && $borrowing->returned_on !== null && $borrowing->getOriginal('returned_on') === null) {
                $borrowing->book()->increment('available_copies');
            } 
            // Alternatively, if the status changes to returned and it wasn't returned already
            elseif ($borrowing->wasChanged('status') && $borrowing->status === 'returned' && $borrowing->getOriginal('status') !== 'returned') {
                if ($borrowing->returned_on === null) {
                    $borrowing->updateQuietly(['returned_on' => now()->toDateString()]);
                }
                $borrowing->book()->increment('available_copies');
            }
        });
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function borrower(): MorphTo
    {
        return $this->morphTo();
    }

    public function issuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logFillable()->logOnlyDirty()->useLogName('library');
    }
}
