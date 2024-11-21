<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Setting extends Model
{
    public $incrementing = false;
    public $timestamps = false;
    protected $primaryKey = null;

    protected $fillable = [
        'name',
        'value',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return [
            'updated_at' => 'datetime',
            'name' => \App\Enums\Setting::class,
        ];
    }

    public function scopeByName(Builder $builder, string $name): void
    {
        $builder->where('name', $name);
    }

    public function scopeByUser(Builder $builder, string $userId): void
    {
        $builder->where('user_id', $userId);
    }
}
