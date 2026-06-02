<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grade_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('code', 40);
            $table->string('label');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['school_id', 'code']);
            $table->index(['school_id', 'sort_order']);
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('code', 40);
            $table->string('name');
            $table->decimal('gpa_weight', 5, 2)->default(1);
            $table->timestamps();

            $table->unique(['school_id', 'code']);
        });

        Schema::create('class_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('grade_level_id')->constrained('grade_levels')->cascadeOnDelete();
            $table->foreignId('campus_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('room')->nullable();
            $table->foreignId('homeroom_teacher_id')->nullable()->references('id')->on('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['school_id', 'academic_year_id']);
        });

        Schema::create('streams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_group_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();

            $table->unique(['class_group_id', 'name']);
        });

        Schema::create('teacher_subject_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_group_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('stream_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('teacher_id')->references('id')->on('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(
                ['academic_year_id', 'subject_id', 'teacher_id', 'class_group_id', 'stream_id'],
                'teacher_subject_alloc_unique'
            );
        });

        Schema::create('exam_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('term_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->date('starts_on')->nullable();
            $table->date('ends_on')->nullable();
            $table->timestamps();

            $table->index(['school_id', 'academic_year_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_sessions');
        Schema::dropIfExists('teacher_subject_allocations');
        Schema::dropIfExists('streams');
        Schema::dropIfExists('class_groups');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('grade_levels');
    }
};
