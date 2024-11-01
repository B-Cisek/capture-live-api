<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string $token_id
 * @property \DateTimeImmutable $expired_at
 */
class BlackListedToken extends Model
{
    public $timestamps = false;
    protected $primaryKey = null;
    public $incrementing = false;

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
