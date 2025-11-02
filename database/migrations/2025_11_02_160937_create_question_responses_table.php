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
        Schema::create('question_responses', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('question_id')->constrained('questions')->onDelete('cascade');
            $table->string('session_id')->index();
            $table->json('response_data');
            $table->timestamp('submitted_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_responses');
    }
};
