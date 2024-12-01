<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Platform;
use App\Enums\RecordingStatus;
use DateTimeImmutable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property Platform $platform
 * @property string $channel
 * @property string $quality
 * @property DateTimeImmutable $start_at
 * @property DateTimeImmutable $end_at
 * @property RecordingStatus $status
 * @property string $user_id
 * @property boolean $is_active
 */
final class Stream extends Model
{
    use HasFactory;
    use HasUuids;

    protected $guarded = ['id'];

    protected $fillable = [
        'platform',
        'channel',
        'start_at',
        'end_at',
        'is_active',
        'status',
        'user_id',
        'quality',
    ];

    public function startRecording(): void
    {
        $this->status = RecordingStatus::IN_PROGRESS;
        $this->save();
    }

    public function stopRecording(): void
    {
        $this->status = RecordingStatus::READY;
        $this->save();
    }

    public function processes(): HasMany
    {
        return $this->hasMany(RecordProcess::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getUserSettings()
    {
        return $this->user->settings;
    }

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'is_active' => 'boolean',
            'status' => RecordingStatus::class,
            'platform' => Platform::class,
        ];
    }
}
