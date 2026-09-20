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
        Schema::create('fines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->enum('period', ['morning_in', 'morning_out', 'afternoon_in', 'afternoon_out']);
            $table->enum('violation_type', ['absent', 'late', 'incomplete']);
            $table->decimal('amount', 8, 2)->default(25.00);
            $table->enum('payment_status', ['unpaid', 'paid', 'waived'])->default('unpaid');
            $table->timestamp('paid_at')->nullable();
            $table->foreignId('waived_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('waiver_reason')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fines');
    }
};
