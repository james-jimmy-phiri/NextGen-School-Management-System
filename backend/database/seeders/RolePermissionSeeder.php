<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $definitions = [
            'dashboard.view',
            'school.manage',
            'campus.manage',
            'calendar.manage',
            'student.manage',
            'attendance.manage',
            'finance.manage',
            'communication.manage',
            'analytics.view',
            'audit.view',
            'settings.manage',
            'integrations.manage',
            'reports.generate',
            'portal.parent',
            'portal.student',
        ];

        foreach ($definitions as $definition) {
            Permission::findOrCreate($definition, 'web');
        }

        Role::findOrCreate('super_admin', 'web')->syncPermissions(Permission::all());

        Role::findOrCreate('school_admin', 'web')->givePermissionTo([
            'dashboard.view',
            'school.manage',
            'campus.manage',
            'calendar.manage',
            'student.manage',
            'attendance.manage',
            'finance.manage',
            'communication.manage',
            'analytics.view',
            'settings.manage',
            'reports.generate',
            'integrations.manage',
        ]);

        Role::findOrCreate('teacher', 'web')->givePermissionTo([
            'dashboard.view',
            'student.manage',
            'attendance.manage',
            'communication.manage',
            'analytics.view',
            'reports.generate',
        ]);

        Role::findOrCreate('accountant', 'web')->givePermissionTo([
            'dashboard.view',
            'finance.manage',
            'analytics.view',
            'reports.generate',
        ]);

        Role::findOrCreate('parent', 'web')->givePermissionTo(['portal.parent']);

        Role::findOrCreate('student', 'web')->givePermissionTo([
            'portal.student',
            'dashboard.view',
        ]);
    }
}
