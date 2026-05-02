<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_group_id')->constrained()->cascadeOnDelete();
            $table->foreignId('term_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('exam_session_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('type', 24)->default('assignment');
            $table->decimal('max_score', 8, 2)->default(100);
            $table->decimal('weight', 8, 4)->default(1);
            $table->timestamp('due_at')->nullable();
            $table->timestamps();

            $table->index(['school_id', 'academic_year_id', 'class_group_id']);
        });

        Schema::create('assessment_marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assessment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->decimal('score', 8, 2)->nullable();
            $table->string('grade')->nullable();
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->unique(['assessment_id', 'student_id']);
        });

        Schema::create('report_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('term_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('gpa', 5, 3)->nullable();
            $table->unsignedInteger('rank')->nullable();
            $table->json('summary')->nullable();
            $table->string('status', 24)->default('draft');
            $table->timestamps();

            $table->unique(['student_id', 'academic_year_id', 'term_id'], 'report_cards_unique_term');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_cards');
        Schema::dropIfExists('assessment_marks');
        Schema::dropIfExists('assessments');
    }
};
