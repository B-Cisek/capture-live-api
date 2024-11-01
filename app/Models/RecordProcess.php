<?php

namespace App\Models;

use App\Enums\ProcessStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecordProcess extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = ['id'];

    protected $fillable = [
        'process_id',
        'status',
        'stop_process'
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'stop_process' => 'boolean',
            'status' => ProcessStatus::class,
        ];
    }

    public function stream(): BelongsTo
    {
        return $this->belongsTo(Stream::class);
    }

    public function stopProcess(): void
    {
        $this->stop_process = true;
        $this->save();
    }
}
