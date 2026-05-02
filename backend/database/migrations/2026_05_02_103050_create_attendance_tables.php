<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->date('date');
            $table->string('status', 24)->default('present');
            $table->timestamp('checked_in_at')->nullable();
            $table->string('method', 24)->default('manual');
            $table->timestamps();

            $table->unique(['user_id', 'date']);
            $table->index(['school_id', 'date']);
        });

        Schema::create('student_attendance_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_group_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->foreignId('marked_by')->references('id')->on('users')->cascadeOnDelete();
            $table->string('method', 24)->default('manual');
            $table->string('source', 32)->nullable();
            $table->timestamps();

            $table->unique(['class_group_id', 'date']);
            $table->index(['school_id', 'date']);
        });

        Schema::create('student_attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('student_attendance_sessions')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('status', 24)->default('present');
            $table->timestamp('arrived_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['session_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_attendance_records');
        Schema::dropIfExists('student_attendance_sessions');
        Schema::dropIfExists('staff_attendances');
    }
};
