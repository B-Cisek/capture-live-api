<?php

namespace App\Services\Cache\Interfaces;

use Psr\SimpleCache\CacheInterface;

interface Cache extends CacheInterface
{
    public function hset(string $key, string $hashKey, mixed $value): int;
}
