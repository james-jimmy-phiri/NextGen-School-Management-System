<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Student;
use Illuminate\Http\Request;

trait AuthorizesPortalStudent
{
    protected function authorizePortalStudent(Request $request, Student $student): void
    {
        if (! $student->guardians()->where('user_id', $request->user()->id)->exists()) {
            abort(403, 'You do not have access to this student profile.');
        }
    }
}
