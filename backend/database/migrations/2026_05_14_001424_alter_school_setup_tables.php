<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('postal_address')->nullable();
            $table->string('primary_color')->nullable();
            $table->string('secondary_color')->nullable();
            $table->string('currency')->default('USD');
        });

        Schema::table('academic_years', function (Blueprint $table) {
            $table->string('status')->default('active'); // active, archived
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
        });

        Schema::table('terms', function (Blueprint $table) {
            $table->boolean('is_active')->default(true);
        });

        Schema::table('class_groups', function (Blueprint $table) {
            $table->string('level')->nullable();
            $table->text('description')->nullable();
        });

        Schema::table('streams', function (Blueprint $table) {
            $table->string('classroom')->nullable();
            $table->integer('capacity')->nullable();
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type')->default('compulsory'); // compulsory, elective
            $table->decimal('pass_mark', 5, 2)->default(50.00);
        });
    }

    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $table->dropColumn(['address', 'phone', 'email', 'website', 'city', 'country', 'postal_address', 'primary_color', 'secondary_color', 'currency']);
        });

        Schema::table('academic_years', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn(['status', 'created_by']);
        });

        Schema::table('terms', function (Blueprint $table) {
            $table->dropColumn(['is_active']);
        });

        Schema::table('class_groups', function (Blueprint $table) {
            $table->dropColumn(['level', 'description']);
        });

        Schema::table('streams', function (Blueprint $table) {
            $table->dropColumn(['classroom', 'capacity']);
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->dropForeign(['teacher_id']);
            $table->dropColumn(['teacher_id', 'type', 'pass_mark']);
        });
    }
};
