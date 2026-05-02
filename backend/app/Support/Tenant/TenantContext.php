<?php

namespace App\Support\Tenant;

use App\Models\School;

class TenantContext
{
    public ?School $school = null;

    public function resolveFromUser(?\App\Models\User $user, ?string $explicitSchoolId = null): void
    {
        if ($user === null) {
            $this->school = null;

            return;
        }

        if ($user->isSuperAdmin() && $explicitSchoolId) {
            $this->school = School::find($explicitSchoolId);

            return;
        }

        $this->school = $user->school_id ? School::find($user->school_id) : null;
    }
}
