<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tableNames = config('permission.table_names');
        $rolesTable = $tableNames['roles'] ?? 'roles';

        if (! Schema::hasColumn($rolesTable, 'requires_school')) {
            Schema::table($rolesTable, function (Blueprint $table) {
                $table->boolean('requires_school')->default(true)->after('guard_name');
            });

            DB::table($rolesTable)
                ->whereIn('name', ['super_admin'])
                ->update(['requires_school' => false]);
        }
    }

    public function down(): void
    {
        $tableNames = config('permission.table_names');
        $rolesTable = $tableNames['roles'] ?? 'roles';

        if (Schema::hasColumn($rolesTable, 'requires_school')) {
            Schema::table($rolesTable, function (Blueprint $table) {
                $table->dropColumn('requires_school');
            });
        }
    }
};
