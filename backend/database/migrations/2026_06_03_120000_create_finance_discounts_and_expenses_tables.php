<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type', 30); // percentage | fixed_amount
            $table->decimal('value', 10, 2);
            $table->string('applies_to', 50)->default('all');
            $table->date('valid_from');
            $table->date('valid_until')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('category', 80);
            $table->text('description');
            $table->decimal('amount', 12, 2);
            $table->date('expense_date');
            $table->string('receipt_path')->nullable();
            $table->string('status', 20)->default('pending'); // pending | approved | rejected
            $table->foreignId('submitted_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('discounts');
    }
};
