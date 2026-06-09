<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class TransportRoute extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $fillable = [
        'school_id',
        'vehicle_id',
        'name',
        'direction',
        'pickup_points',
    ];

    protected function casts(): array
    {
        return [
            'pickup_points' => 'array',
        ];
    }

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function studentTransports(): HasMany
    {
        return $this->hasMany(StudentTransport::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logFillable()->logOnlyDirty()->useLogName('transport');
    }
}
