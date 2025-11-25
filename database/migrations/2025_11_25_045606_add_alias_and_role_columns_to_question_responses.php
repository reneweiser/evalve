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
        Schema::table('question_responses', function (Blueprint $table) {
            $table->string('alias')->after('session_id');
            $table->string('role')->after('alias');
        });
    }
};
