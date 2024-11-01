<?php

namespace App\Models;

use App\Enums\RecordingStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stream extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = ['id'];

    protected $fillable = [
        'platform',
        'username',
        'start_at',
        'end_at',
        'is_active',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'is_active' => 'boolean',
            'status' => RecordingStatus::class,
        ];
    }

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
}
