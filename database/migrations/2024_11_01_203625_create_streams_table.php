<?php

declare(strict_types=1);

use App\Enums\Platform;
use App\Enums\RecordingStatus;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('streams', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignIdFor(User::class);
            $table->enum('platform', Platform::toArray());
            $table->string('channel');
            $table->string('quality')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('start_at')->nullable();
            $table->timestamp('end_at')->nullable();
            $table->enum('status', RecordingStatus::toArray())->default(RecordingStatus::READY);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('streams');
    }
};
