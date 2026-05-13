<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * All system permissions grouped by module.
     * Format: 'module.action'
     */
    private array $permissions = [
        // ── Platform / System ──────────────────────────────────────────────────
        'platform.manage',      // Super admin only: manage schools, billing, platform config
        'audit.view',           // View system audit logs
        'settings.manage',      // School-level settings

        // ── Users & Access ─────────────────────────────────────────────────────
        'users.view',
        'users.create',
        'users.edit',
        'users.deactivate',
        'users.delete',
        'roles.manage',         // Manage role permissions matrix (super admin only)

        // ── School Management ──────────────────────────────────────────────────
        'school.manage',        // Edit school profile, branding, campuses
        'campus.manage',

        // ── Academic Calendar ──────────────────────────────────────────────────
        'calendar.manage',      // Academic years, terms

        // ── Students & Admissions ─────────────────────────────────────────────
        'students.view',
        'students.create',
        'students.edit',
        'students.delete',
        'admissions.manage',    // Registrar-specific admission workflows

        // ── Attendance ────────────────────────────────────────────────────────
        'attendance.view',
        'attendance.manage',

        // ── Academics / Assessments ───────────────────────────────────────────
        'assessments.view',
        'assessments.manage',
        'reports.generate',

        // ── Finance ───────────────────────────────────────────────────────────
        'finance.view',
        'finance.manage',
        'invoices.manage',
        'payments.manage',

        // ── Communication ─────────────────────────────────────────────────────
        'communication.manage',

        // ── Library ───────────────────────────────────────────────────────────
        'library.view',
        'library.manage',

        // ── Hostel ────────────────────────────────────────────────────────────
        'hostel.view',
        'hostel.manage',

        // ── Transport ─────────────────────────────────────────────────────────
        'transport.view',
        'transport.manage',

        // ── Health / Nurse ────────────────────────────────────────────────────
        'health.view',
        'health.manage',

        // ── Portals ───────────────────────────────────────────────────────────
        'portal.parent',
        'portal.student',

        // ── Analytics ─────────────────────────────────────────────────────────
        'analytics.view',
    ];

    /**
     * Role → permission mapping.
     * super_admin receives ALL permissions automatically.
     */
    private array $rolePermissions = [
        'school_director' => [
            'audit.view',
            'settings.manage',
            'roles.manage',
            'users.view',
            'users.create',
            'users.edit',
            'users.deactivate',
            'school.manage',
            'campus.manage',
            'calendar.manage',
            'students.view',
            'students.create',
            'students.edit',
            'admissions.manage',
            'attendance.view',
            'attendance.manage',
            'assessments.view',
            'assessments.manage',
            'reports.generate',
            'finance.view',
            'finance.manage',
            'invoices.manage',
            'payments.manage',
            'communication.manage',
            'library.view',
            'library.manage',
            'hostel.view',
            'hostel.manage',
            'transport.view',
            'transport.manage',
            'health.view',
            'health.manage',
            'analytics.view',
        ],

        'school_admin' => [
            'audit.view',
            'settings.manage',
            'users.view',
            'users.create',
            'users.edit',
            'users.deactivate',
            'school.manage',
            'campus.manage',
            'calendar.manage',
            'students.view',
            'students.create',
            'students.edit',
            'attendance.view',
            'attendance.manage',
            'assessments.view',
            'assessments.manage',
            'reports.generate',
            'finance.view',
            'finance.manage',
            'invoices.manage',
            'payments.manage',
            'communication.manage',
            'analytics.view',
        ],

        'accountant' => [
            'finance.view',
            'finance.manage',
            'invoices.manage',
            'payments.manage',
            'reports.generate',
            'analytics.view',
            'students.view',
        ],

        'registrar' => [
            'students.view',
            'students.create',
            'students.edit',
            'admissions.manage',
            'attendance.view',
            'reports.generate',
        ],

        'teacher' => [
            'students.view',
            'attendance.view',
            'attendance.manage',
            'assessments.view',
            'assessments.manage',
            'communication.manage',
            'reports.generate',
        ],

        'librarian' => [
            'library.view',
            'library.manage',
            'students.view',
        ],

        'hostel_master' => [
            'hostel.view',
            'hostel.manage',
            'students.view',
        ],

        'transport_officer' => [
            'transport.view',
            'transport.manage',
            'students.view',
        ],

        'nurse' => [
            'health.view',
            'health.manage',
            'students.view',
        ],

        'parent' => [
            'portal.parent',
        ],

        'student' => [
            'portal.student',
        ],
    ];

    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create all permissions
        foreach ($this->permissions as $permName) {
            Permission::findOrCreate($permName, 'web');
            Permission::findOrCreate($permName, 'sanctum'); // for API (mobile)
        }

        // Super admin gets everything
        $superAdmin = Role::findOrCreate('super_admin', 'web');
        $superAdmin->syncPermissions(Permission::where('guard_name', 'web')->get());

        $superAdminApi = Role::findOrCreate('super_admin', 'sanctum');
        $superAdminApi->syncPermissions(Permission::where('guard_name', 'sanctum')->get());

        // All other roles
        foreach ($this->rolePermissions as $roleName => $perms) {
            // Web guard
            $role = Role::findOrCreate($roleName, 'web');
            $role->syncPermissions(
                Permission::whereIn('name', $perms)->where('guard_name', 'web')->get()
            );

            // Sanctum guard (API / mobile)
            $roleApi = Role::findOrCreate($roleName, 'sanctum');
            $roleApi->syncPermissions(
                Permission::whereIn('name', $perms)->where('guard_name', 'sanctum')->get()
            );
        }

        $this->command->info('✅ Roles & permissions seeded — '.count($this->permissions).' permissions across '.(count($this->rolePermissions) + 1).' roles.');
    }
}
