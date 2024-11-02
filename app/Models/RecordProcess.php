<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ProcessStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class RecordProcess extends Model
{
    use HasFactory;
    use HasUuids;

    protected $guarded = ['id'];

    protected $fillable = [
        'process_id',
        'status',
        'stop_process',
    ];

    public function stream(): BelongsTo
    {
        return $this->belongsTo(Stream::class);
    }

    public function stopProcess(): void
    {
        $this->stop_process = true;
        $this->save();
    }

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'stop_process' => 'boolean',
            'status' => ProcessStatus::class,
        ];
    }
}
