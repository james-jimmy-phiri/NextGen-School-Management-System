<?php

namespace App\Policies;

use App\Models\School;
use App\Models\User;

class SchoolPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'school_admin', 'teacher', 'accountant']);
    }

    public function view(User $user, School $school): bool
    {
        return $this->managesTenant($user, $school->id);
    }

    public function create(User $user): bool
    {
        return $user->hasRole('super_admin');
    }

    public function update(User $user, School $school): bool
    {
        return $this->managesTenant($user, $school->id)
            && $user->hasAnyRole(['super_admin', 'school_admin']);
    }

    public function delete(User $user, School $school): bool
    {
        return $user->hasRole('super_admin');
    }

    protected function managesTenant(User $user, ?int $schoolId): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        return $schoolId !== null && $user->school_id === $schoolId;
    }
}
