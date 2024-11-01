<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('black_listed_tokens', function (Blueprint $table) {
            $table->string('token_id')->unique()->index();
            $table->timestamp('expired_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('black_listed_tokens');
    }
};
