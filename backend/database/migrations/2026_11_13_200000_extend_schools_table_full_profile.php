<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            // ── School Identity ──────────────────────────────────────────────
            $table->string('short_name', 30)->nullable()->after('name');         // abbreviation
            $table->string('motto', 255)->nullable()->after('short_name');
            $table->string('registration_number', 100)->nullable()->after('motto');
            $table->string('school_type')->nullable()->after('registration_number');  // Primary, Secondary, Combined
            $table->string('ownership')->nullable()->after('school_type');             // Private, Government, Mission, Community
            $table->smallInteger('year_established')->nullable()->after('ownership');
            $table->string('education_level')->nullable()->after('year_established'); // e.g. ECCD, Primary, Secondary

            // ── Contact: extra fields ────────────────────────────────────────
            $table->string('alt_phone', 50)->nullable()->after('phone');
            $table->string('district', 100)->nullable()->after('city');
            $table->string('region', 100)->nullable()->after('district');

            // ── GPS / Location ────────────────────────────────────────────────
            $table->decimal('gps_lat', 10, 7)->nullable()->after('region');
            $table->decimal('gps_lng', 10, 7)->nullable()->after('gps_lat');

            // ── School Leadership ─────────────────────────────────────────────
            $table->string('principal_name', 150)->nullable()->after('gps_lng');
            $table->string('deputy_principal_name', 150)->nullable()->after('principal_name');
            $table->string('director_name', 150)->nullable()->after('deputy_principal_name');
            $table->string('administrator_name', 150)->nullable()->after('director_name');
            $table->string('bursar_name', 150)->nullable()->after('administrator_name');
            $table->string('academic_director_name', 150)->nullable()->after('bursar_name');

            // ── UUID for public-facing routes (edit, profile, API) ───────────
            $table->uuid('uuid')->nullable()->unique()->after('id');
        });

        // Back-fill UUIDs for any existing schools
        \Illuminate\Support\Facades\DB::statement(
            'UPDATE schools SET uuid = UUID() WHERE uuid IS NULL'
        );

        // Now enforce NOT NULL after back-fill
        Schema::table('schools', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->dropColumn([
                'short_name', 'motto', 'registration_number',
                'school_type', 'ownership', 'year_established', 'education_level',
                'alt_phone', 'district', 'region',
                'gps_lat', 'gps_lng',
                'principal_name', 'deputy_principal_name', 'director_name',
                'administrator_name', 'bursar_name', 'academic_director_name',
                'uuid',
            ]);
        });
    }
};

