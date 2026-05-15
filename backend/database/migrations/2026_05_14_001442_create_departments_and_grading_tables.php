<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type')->default('academic'); // academic, administrative
            $table->text('description')->nullable();
            $table->foreignId('head_of_department_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->unique(['school_id', 'name']);
        });

        Schema::create('grading_systems', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type')->default('gpa'); // gpa, percentage, custom
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('grading_scales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grading_system_id')->constrained()->cascadeOnDelete();
            $table->decimal('min_score', 5, 2);
            $table->decimal('max_score', 5, 2);
            $table->string('grade');
            $table->string('remark')->nullable();
            $table->decimal('points', 4, 2)->default(0);
            $table->timestamps();
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn(['department_id']);
        });

        Schema::dropIfExists('grading_scales');
        Schema::dropIfExists('grading_systems');
        Schema::dropIfExists('departments');
    }
};
