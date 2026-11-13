<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens;

    use HasFactory;
    use HasRoles;
    use LogsActivity;
    use Notifiable;

    protected $fillable = [
        'school_id',
        'name',
        'email',
        'phone',
        'password',
        'avatar_path',
        'preferences',
        'status',
        'failed_login_attempts',
        'locked_at',
        'locked_reason',
        'deactivated_at',
        'deactivated_reason',
        'last_login_at',
        'last_login_ip',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $attributes = [
        'status' => 'active',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'locked_at' => 'datetime',
            'deactivated_at' => 'datetime',
            'password' => 'hashed',
            'preferences' => 'array',
            'failed_login_attempts' => 'integer',
        ];
    }

    // ─── Activity Log ──────────────────────────────────────────────────────────

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'phone', 'status', 'school_id'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('user');
    }

    // ─── Relationships ─────────────────────────────────────────────────────────

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function otpCodes(): HasMany
    {
        return $this->hasMany(OtpCode::class);
    }

    public function devices(): HasMany
    {
        return $this->hasMany(UserDevice::class);
    }

    public function staffProfile(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(StaffProfile::class);
    }

    public function supportTickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function assignedTickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class, 'assigned_to');
    }

    public function reviewedLeaves(): HasMany
    {
        return $this->hasMany(LeaveRequest::class, 'reviewed_by');
    }

    public function approvedPayrolls(): HasMany
    {
        return $this->hasMany(Payroll::class, 'approved_by');
    }

    public function allocatedHostels(): HasMany
    {
        return $this->hasMany(HostelAllocation::class, 'allocated_by');
    }

    public function issuedBorrowings(): HasMany
    {
        return $this->hasMany(BookBorrowing::class, 'issued_by');
    }

    // ─── Scopes ────────────────────────────────────────────────────────────────

    public function scopeForSchool($query, int $schoolId)
    {
        return $query->where('school_id', $schoolId);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && ! $this->isLocked();
    }

    public function isLocked(): bool
    {
        return $this->locked_at !== null;
    }

    public function registerFailedLogin(int $threshold = 5): void
    {
        $attempts = $this->failed_login_attempts + 1;
        $payload = ['failed_login_attempts' => $attempts];

        if ($attempts >= $threshold) {
            $payload['locked_at'] = now();
            $payload['locked_reason'] = 'Too many failed login attempts';
            $payload['status'] = 'suspended';
        }

        $this->forceFill($payload)->save();
    }

    public function clearFailedLogins(): void
    {
        if ($this->failed_login_attempts === 0 && $this->locked_at === null) {
            return;
        }

        $this->forceFill([
            'failed_login_attempts' => 0,
            'locked_at' => null,
            'locked_reason' => null,
        ])->save();
    }

    public function unlock(string $status = 'active'): void
    {
        $this->forceFill([
            'failed_login_attempts' => 0,
            'locked_at' => null,
            'locked_reason' => null,
            'status' => $status,
        ])->save();
    }

    public function deactivate(string $reason): void
    {
        $this->forceFill([
            'status' => 'inactive',
            'deactivated_at' => now(),
            'deactivated_reason' => $reason,
        ])->save();
    }

    public function reactivate(): void
    {
        $this->forceFill([
            'status' => 'active',
            'deactivated_at' => null,
            'deactivated_reason' => null,
            'locked_at' => null,
            'locked_reason' => null,
            'failed_login_attempts' => 0,
        ])->save();
    }

    public function isDeactivated(): bool
    {
        return $this->status === 'inactive' || $this->deactivated_at !== null;
    }

    public function hasSchool(): bool
    {
        return $this->school_id !== null;
    }

    public function getAvatarInitialsAttribute(): string
    {
        return collect(explode(' ', $this->name))
            ->map(fn ($part) => strtoupper(substr($part, 0, 1)))
            ->take(2)
            ->implode('');
    }

    public function getPrimaryRoleAttribute(): ?string
    {
        return $this->roles->first()?->name;
    }
}
