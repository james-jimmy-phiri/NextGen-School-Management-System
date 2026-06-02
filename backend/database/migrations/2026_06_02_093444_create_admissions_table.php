<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('class_group_id')->nullable()->constrained()->nullOnDelete();
            $table->string('reference_number')->unique();
            
            // Student details
            $table->string('student_first_name');
            $table->string('student_middle_name')->nullable();
            $table->string('student_last_name');
            $table->string('gender', 20)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->string('nationality')->nullable();
            $table->string('religion')->nullable();
            $table->string('birth_certificate_number')->nullable();
            
            // Previous School
            $table->string('previous_school_name')->nullable();
            $table->string('previous_grade')->nullable();
            $table->string('transfer_reason')->nullable();
            
            // Application details
            $table->string('boarding_type')->default('day'); // 'day', 'boarding'
            
            // Parent/Guardian details
            $table->string('parent_name');
            $table->string('parent_relationship', 40)->default('parent');
            $table->string('parent_phone')->nullable();
            $table->string('parent_email')->nullable();
            $table->string('parent_occupation')->nullable();
            $table->text('parent_address')->nullable();
            
            // Workflow & Storage
            $table->string('status', 30)->default('submitted'); // submitted, under_review, accepted, rejected, waitlisted, enrolled
            $table->json('documents')->nullable(); // JSON object for file paths
            $table->text('internal_notes')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['school_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admissions');
    }
};
