<?php

declare(strict_types=1);

use App\Enums\ProcessStatus;
use App\Models\Stream;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('record_processes', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignIdFor(Stream::class);
            $table->integer('process_id');
            $table->boolean('stop_process')->default(false);
            $table->enum('status', ProcessStatus::toArray());
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('record_processes');
    }
};
