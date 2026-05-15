<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SchoolSetupPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'school_setup.view',
            'school_setup.create',
            'school_setup.edit',
            'school_setup.delete',
            'academic_years.manage',
            'terms.manage',
            'classes.manage',
            'subjects.manage',
            'grading.manage',
        ];

        $guards = ['web', 'sanctum'];
        foreach ($guards as $guard) {
            foreach ($permissions as $permission) {
                Permission::firstOrCreate(['name' => $permission, 'guard_name' => $guard]);
            }
        }

        $role = Role::where('name', 'super_admin')->first();
        if ($role) {
            $role->givePermissionTo($permissions);
        }
    }
}
