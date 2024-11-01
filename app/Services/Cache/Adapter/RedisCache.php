<?php

declare(strict_types=1);

namespace App\Services\Cache\Adapter;

use App\Services\Cache\Interfaces\Cache;
use Illuminate\Support\Facades\Redis;

class RedisCache implements Cache
{
    public function get(string $key, mixed $default = null): mixed
    {
        return Redis::get($key, $default);
    }

    public function set(string $key, mixed $value, \DateInterval|int|null $ttl = null): bool
    {
        return Redis::set($key, $value, $ttl);
    }

    public function delete(string $key): bool
    {
        return Redis::delete($key);
    }

    public function clear(): bool
    {
        return Redis::clear();
    }

    public function getMultiple(iterable $keys, mixed $default = null): iterable
    {
        return Redis::getMultiple($keys, $default);
    }

    public function setMultiple(iterable $values, \DateInterval|int|null $ttl = null): bool
    {
        return Redis::setMultiple($values, $ttl);
    }

    public function deleteMultiple(iterable $keys): bool
    {
        return Redis::deleteMultiple($keys);
    }

    public function has(string $key): bool
    {
        return Redis::has($key);
    }

    public function hset(string $key, string $hashKey, mixed $value): int
    {
        return Redis::hset($key, $hashKey, $value);
    }
}
