<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDevice extends Model
{
    protected $fillable = [
        'user_id',
        'device_token',
        'device_name',
        'ip_address',
        'user_agent',
        'is_trusted',
        'trusted_at',
        'last_used_at',
    ];

    protected function casts(): array
    {
        return [
            'is_trusted' => 'boolean',
            'trusted_at' => 'datetime',
            'last_used_at' => 'datetime',
        ];
    }

    // ─── Relationships ─────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Register or touch an existing device record for a user.
     */
    public static function remember(User $user, string $userAgent, string $ipAddress): self
    {
        $token = hash('sha256', $user->id.$userAgent.$ipAddress);

        return static::updateOrCreate(
            ['device_token' => $token],
            [
                'user_id' => $user->id,
                'device_name' => static::parseDeviceName($userAgent),
                'ip_address' => $ipAddress,
                'user_agent' => substr($userAgent, 0, 512),
                'last_used_at' => now(),
            ]
        );
    }

    /**
     * Mark this device as trusted (skips 2FA for future logins).
     */
    public function trust(): void
    {
        $this->update([
            'is_trusted' => true,
            'trusted_at' => now(),
        ]);
    }

    public static function parseDeviceName(string $userAgent): string
    {
        if (str_contains($userAgent, 'Mobile') || str_contains($userAgent, 'Android')) {
            return 'Mobile Device';
        }
        if (str_contains($userAgent, 'Chrome')) {
            return 'Chrome Browser';
        }
        if (str_contains($userAgent, 'Firefox')) {
            return 'Firefox Browser';
        }
        if (str_contains($userAgent, 'Safari')) {
            return 'Safari Browser';
        }

        return 'Unknown Device';
    }
}
