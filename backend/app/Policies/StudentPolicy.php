<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;

class StudentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'school_admin', 'teacher', 'accountant']);
    }

    public function view(User $user, Student $student): bool
    {
        return $user->isSuperAdmin() || $user->school_id === $student->school_id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super_admin', 'school_admin']);
    }

    public function update(User $user, Student $student): bool
    {
        return $user->hasAnyRole(['super_admin', 'school_admin', 'teacher'])
            && ($user->isSuperAdmin() || $user->school_id === $student->school_id);
    }

    public function delete(User $user, Student $student): bool
    {
        return $user->hasAnyRole(['super_admin', 'school_admin'])
            && ($user->isSuperAdmin() || $user->school_id === $student->school_id);
    }
}
