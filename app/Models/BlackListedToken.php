<?php

declare(strict_types=1);

namespace App\Models;

use DateTimeImmutable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $token_id
 * @property DateTimeImmutable $expired_at
 */
final class BlackListedToken extends Model
{
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = null;

    protected $fillable = [
        'token_id',
        'expired_at',
    ];

    protected function casts(): array
    {
        return [
            'expired_at' => 'datetime',
        ];
    }
}
