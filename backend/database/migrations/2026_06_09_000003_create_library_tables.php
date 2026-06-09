<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('title', 300);
            $table->string('author', 200)->nullable();
            $table->string('isbn', 50)->nullable();
            $table->string('category', 100)->nullable();
            $table->string('publisher', 200)->nullable();
            $table->integer('publish_year')->nullable();
            $table->integer('total_copies')->default(1);
            $table->integer('available_copies')->default(1);
            $table->string('shelf_location', 80)->nullable();
            $table->string('cover_path')->nullable();
            $table->timestamps();
        });

        Schema::create('book_borrowings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
            $table->string('borrower_type'); // morph relation type
            $table->unsignedBigInteger('borrower_id'); // morph relation id
            $table->foreignId('issued_by')->references('id')->on('users')->cascadeOnDelete();
            $table->date('issued_on');
            $table->date('due_on');
            $table->date('returned_on')->nullable();
            $table->decimal('fine_amount', 8, 2)->default(0);
            $table->boolean('fine_paid')->default(false);
            $table->string('status', 20)->default('active'); // active | returned | overdue | lost
            $table->timestamps();

            $table->index(['borrower_type', 'borrower_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('book_borrowings');
        Schema::dropIfExists('books');
    }
};
