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
        // 1. Update students table
        Schema::table('students', function (Blueprint $table) {
            $table->string('registration_number')->unique()->nullable()->after('id');
            $table->string('national_id_passport')->nullable()->after('admission_number');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('place_of_birth')->nullable()->after('date_of_birth');
            $table->string('nationality')->nullable()->after('place_of_birth');
            $table->string('marital_status')->nullable()->after('nationality');
            $table->string('religion')->nullable()->after('marital_status');
            $table->boolean('consent_policies')->default(false);
            $table->boolean('consent_privacy')->default(false);
            $table->string('digital_signature')->nullable();
            $table->date('signature_date')->nullable();
        });

        // 2. Create student_addresses table
        Schema::create('student_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable();
            $table->string('house_number')->nullable();
            $table->string('street_name')->nullable();
            $table->string('area_village');
            $table->string('traditional_authority')->nullable();
            $table->string('district');
            $table->string('city_town');
            $table->string('postal_address')->nullable();
            $table->string('country');
            $table->timestamps();
        });

        // 3. Update student_enrollments table
        Schema::table('student_enrollments', function (Blueprint $table) {
            $table->foreignId('campus_id')->nullable()->constrained('campuses')->nullOnDelete();
            $table->string('mode_of_study')->nullable();
            $table->integer('year_of_study')->nullable();
            $table->foreignId('term_id')->nullable()->constrained('terms')->nullOnDelete();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
        });

        // 4. Update guardians table
        Schema::table('guardians', function (Blueprint $table) {
            $table->string('gender', 20)->nullable();
            $table->string('national_id')->nullable();
            $table->string('occupation')->nullable();
            $table->string('employer')->nullable();
            $table->string('alternative_phone')->nullable();
            $table->text('address')->nullable();
        });

        // 5. Create sponsors table
        Schema::create('sponsors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('sponsorship_type');
            $table->string('sponsor_name')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });

        // 6. Create medical_records table
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('health_status')->nullable();
            $table->string('blood_group', 10)->nullable();
            $table->boolean('has_disability')->default(false);
            $table->string('disability_type')->nullable();
            $table->text('chronic_conditions')->nullable();
            $table->text('allergies')->nullable();
            $table->text('medications')->nullable();
            $table->text('special_needs')->nullable();
            $table->timestamps();
        });

        // 7. Create emergency_contacts table
        Schema::create('emergency_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('full_name');
            $table->string('relationship');
            $table->string('phone_number');
            $table->string('alternative_phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });

        // 8. Create documents table
        Schema::create('student_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('document_type');
            $table->string('file_path');
            $table->string('file_name');
            $table->timestamps();
        });

        // 9. Update users table (optional accounts)
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->nullable()->after('email');
            $table->string('security_question')->nullable();
            $table->string('security_answer')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_documents');
        Schema::dropIfExists('emergency_contacts');
        Schema::dropIfExists('medical_records');
        Schema::dropIfExists('sponsors');
        Schema::dropIfExists('student_addresses');

        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'registration_number', 'national_id_passport', 'middle_name',
                'place_of_birth', 'nationality', 'marital_status', 'religion',
                'consent_policies', 'consent_privacy', 'digital_signature', 'signature_date'
            ]);
        });

        Schema::table('student_enrollments', function (Blueprint $table) {
            $table->dropForeign(['campus_id']);
            $table->dropForeign(['term_id']);
            $table->dropColumn(['campus_id', 'term_id', 'mode_of_study', 'year_of_study', 'start_date', 'end_date']);
        });

        Schema::table('guardians', function (Blueprint $table) {
            $table->dropColumn(['gender', 'national_id', 'occupation', 'employer', 'alternative_phone', 'address']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'security_question', 'security_answer']);
        });
    }
};
