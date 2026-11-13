<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DemoTenantSeeder extends Seeder
{
    protected string $demoPassword = 'Demo#2026Pass';

    public function run(): void
    {
        $this->call([
            SuperAdminSeeder::class,
            SunriseAcademySeeder::class,
            HorizonInternationalSeeder::class,
            StAugustineAcademySeeder::class,
        ]);

        $this->command?->newLine();
        $this->command?->info('======================================================================');
        $this->command?->info('  🎉 ALL 3 DEMO SCHOOLS SEEDED SUCCESSFULLY (5+ TERMS OF OPERATIONS)  ');
        $this->command?->info('======================================================================');

        $this->command?->newLine();
        $this->command?->info('🔑 PLATFORM SUPER ADMINISTRATOR');
        $this->command?->table(
            ['System Role', 'Email', 'Password'],
            [
                ['Platform Super Admin', 'super.admin@nextgen.mw', $this->demoPassword],
            ]
        );

        $this->command?->newLine();
        $this->command?->info('🏫 SCHOOL 1: SUNRISE ACADEMY (Area 47, Lilongwe)');
        $this->command?->table(
            ['Role', 'Email', 'Password'],
            [
                ['School Director',   'director@sunrise.demo',    $this->demoPassword],
                ['School Admin',      'admin@sunrise.demo',       $this->demoPassword],
                ['Accountant',        'finance@sunrise.demo',     $this->demoPassword],
                ['Registrar',         'registrar@sunrise.demo',   $this->demoPassword],
                ['Head Teacher',      'teacher@sunrise.demo',     $this->demoPassword],
                ['Librarian',         'library@sunrise.demo',     $this->demoPassword],
                ['Hostel Master',     'hostel@sunrise.demo',      $this->demoPassword],
                ['Transport Officer', 'transport@sunrise.demo',   $this->demoPassword],
                ['School Nurse',      'nurse@sunrise.demo',       $this->demoPassword],
                ['Parent Portal',     'parent@sunrise.demo',      $this->demoPassword],
                ['Student Portal',    'student@sunrise.demo',     $this->demoPassword],
            ]
        );

        $this->command?->newLine();
        $this->command?->info('🏫 SCHOOL 2: HORIZON INTERNATIONAL SCHOOL (Nyambadwe, Blantyre)');
        $this->command?->table(
            ['Role', 'Email', 'Password'],
            [
                ['School Director',   'director@horizon.demo',    $this->demoPassword],
                ['School Admin',      'admin@horizon.demo',       $this->demoPassword],
                ['Accountant',        'finance@horizon.demo',     $this->demoPassword],
                ['Registrar',         'registrar@horizon.demo',   $this->demoPassword],
                ['Head Teacher',      'teacher@horizon.demo',     $this->demoPassword],
                ['Librarian',         'library@horizon.demo',     $this->demoPassword],
                ['Hostel Master',     'hostel@horizon.demo',      $this->demoPassword],
                ['Transport Officer', 'transport@horizon.demo',   $this->demoPassword],
                ['School Nurse',      'nurse@horizon.demo',       $this->demoPassword],
                ['Parent Portal',     'parent@horizon.demo',      $this->demoPassword],
                ['Student Portal',    'student@horizon.demo',     $this->demoPassword],
            ]
        );

        $this->command?->newLine();
        $this->command?->info('🏫 SCHOOL 3: ST. AUGUSTINE ACADEMY (Katoto, Mzuzu)');
        $this->command?->table(
            ['Role', 'Email', 'Password'],
            [
                ['School Director',   'director@staugustine.demo',  $this->demoPassword],
                ['School Admin',      'admin@staugustine.demo',     $this->demoPassword],
                ['Accountant',        'finance@staugustine.demo',   $this->demoPassword],
                ['Registrar',         'registrar@staugustine.demo', $this->demoPassword],
                ['Head Teacher',      'teacher@staugustine.demo',   $this->demoPassword],
                ['Librarian',         'library@staugustine.demo',   $this->demoPassword],
                ['Hostel Master',     'hostel@staugustine.demo',    $this->demoPassword],
                ['Transport Officer', 'transport@staugustine.demo', $this->demoPassword],
                ['School Nurse',      'nurse@staugustine.demo',     $this->demoPassword],
                ['Parent Portal',     'parent@staugustine.demo',    $this->demoPassword],
                ['Student Portal',    'student@staugustine.demo',   $this->demoPassword],
            ]
        );
    }
}
