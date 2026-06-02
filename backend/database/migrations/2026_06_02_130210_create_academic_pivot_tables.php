<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Link Subjects to Classes
        Schema::create('class_group_subject', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_group_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_core')->default(true);
            $table->timestamps();

            $table->unique(['class_group_id', 'subject_id']);
        });

        // 2. Link Students to Subjects
        Schema::create('student_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['student_id', 'subject_id', 'academic_year_id'], 'student_subject_year_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_subjects');
        Schema::dropIfExists('class_group_subject');
    }
};
