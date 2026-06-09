<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('plan', 50); // starter | standard | premium
            $table->string('billing_cycle', 20); // monthly | termly | annual
            $table->decimal('amount', 12, 2);
            $table->date('starts_at');
            $table->date('ends_at');
            $table->string('status', 20); // active | expired | cancelled | suspended
            $table->text('invoice_url')->nullable();
            $table->string('payment_ref', 100)->nullable();
            $table->timestamps();
        });

        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // raised_by
            $table->string('subject', 200);
            $table->text('description');
            $table->string('priority', 20)->default('medium'); // low | medium | high | critical
            $table->string('status', 20)->default('open'); // open | in_progress | resolved | closed
            $table->foreignId('assigned_to')->nullable()->references('id')->on('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('subscriptions');
    }
};
