<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class DeactivateInactiveUsers extends Command
{
    protected $signature = 'users:deactivate-inactive {--months=6 : Months of inactivity before deactivation}';

    protected $description = 'Deactivate accounts that have not accessed the system for a given number of months (default 6)';

    public function handle(): int
    {
        $months = (int) $this->option('months');
        $cutoff = now()->subMonths($months);

        $users = User::query()
            ->where('status', 'active')
            ->whereDoesntHave('roles', fn ($q) => $q->where('name', 'super_admin'))
            ->where(function ($q) use ($cutoff) {
                $q->where(function ($sq) use ($cutoff) {
                    $sq->whereNotNull('last_login_at')
                        ->where('last_login_at', '<', $cutoff);
                })->orWhere(function ($sq) use ($cutoff) {
                    $sq->whereNull('last_login_at')
                        ->where('created_at', '<', $cutoff);
                });
            })
            ->get();

        $count = $users->count();
        $this->info("Found {$count} inactive user(s) to deactivate.");

        foreach ($users as $user) {
            $user->deactivate("Automatically deactivated after {$months} months without accessing the system");
            activity('user')
                ->performedOn($user)
                ->log("System automatically deactivated user due to {$months}+ months of inactivity");
        }

        $this->info("Successfully deactivated {$count} user(s).");

        return self::SUCCESS;
    }
}
