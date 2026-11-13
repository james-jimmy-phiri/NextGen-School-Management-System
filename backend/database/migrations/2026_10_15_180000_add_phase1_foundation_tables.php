<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedTinyInteger('failed_login_attempts')->default(0)->after('status');
            $table->timestamp('locked_at')->nullable()->after('failed_login_attempts');
            $table->string('locked_reason')->nullable()->after('locked_at');
        });

        Schema::create('document_sequences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('document_type', 40);
            $table->string('prefix', 20);
            $table->boolean('include_year')->default(true);
            $table->unsignedTinyInteger('padding')->default(5);
            $table->unsignedInteger('next_number')->default(1);
            $table->timestamps();

            $table->unique(['school_id', 'document_type']);
        });

        Schema::create('families', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->foreignId('payer_guardian_id')->nullable()->constrained('guardians')->nullOnDelete();
            $table->timestamps();

            $table->index(['school_id', 'name']);
        });

        Schema::table('guardians', function (Blueprint $table) {
            $table->timestamp('verified_at')->nullable()->after('address');
            $table->foreignId('verified_by')->nullable()->after('verified_at')->constrained('users')->nullOnDelete();
        });

        Schema::table('students', function (Blueprint $table) {
            $table->foreignId('family_id')->nullable()->after('school_id')->constrained('families')->nullOnDelete();
            $table->foreignId('responsible_guardian_id')->nullable()->after('family_id')->constrained('guardians')->nullOnDelete();
            $table->string('status_reason')->nullable()->after('status');
            $table->date('left_on')->nullable()->after('status_reason');
        });

        Schema::create('data_imports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('type', 40);
            $table->string('status', 24)->default('previewed');
            $table->string('original_filename')->nullable();
            $table->json('rows')->nullable();
            $table->json('errors')->nullable();
            $table->unsignedInteger('committed_count')->default(0);
            $table->timestamp('committed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_imports');

        Schema::table('students', function (Blueprint $table) {
            $table->dropConstrainedForeignId('family_id');
            $table->dropConstrainedForeignId('responsible_guardian_id');
            $table->dropColumn(['status_reason', 'left_on']);
        });

        Schema::table('guardians', function (Blueprint $table) {
            $table->dropConstrainedForeignId('verified_by');
            $table->dropColumn('verified_at');
        });

        Schema::dropIfExists('families');
        Schema::dropIfExists('document_sequences');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['failed_login_attempts', 'locked_at', 'locked_reason']);
        });
    }
};
