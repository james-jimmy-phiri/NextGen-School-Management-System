<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Hash;

class OtpCode extends Model
{
    protected $fillable = [
        'user_id',
        'code',
        'purpose',
        'identifier',
        'attempts',
        'expires_at',
        'used_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'used_at' => 'datetime',
        ];
    }

    // ─── Relationships ─────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Generate a new OTP for a user and purpose. Invalidates previous ones.
     */
    public static function generate(User $user, string $purpose, int $digits = 6): self
    {
        // Expire all previous OTPs for this user/purpose
        static::where('user_id', $user->id)
            ->where('purpose', $purpose)
            ->whereNull('used_at')
            ->update(['used_at' => now()]);

        $plain = str_pad((string) random_int(0, (int) str_repeat('9', $digits)), $digits, '0', STR_PAD_LEFT);

        return static::create([
            'user_id' => $user->id,
            'code' => Hash::make($plain),
            'purpose' => $purpose,
            'identifier' => $user->email,
            'expires_at' => now()->addMinutes(15),
        ]);
    }

    /**
     * Verify a plain OTP code against this record.
     */
    public function verify(string $plainCode): bool
    {
        if ($this->isExpired() || $this->isUsed()) {
            return false;
        }

        if ($this->attempts >= 5) {
            return false;
        }

        $this->increment('attempts');

        if (! Hash::check($plainCode, $this->code)) {
            return false;
        }

        $this->update(['used_at' => now()]);

        return true;
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isUsed(): bool
    {
        return $this->used_at !== null;
    }
}
