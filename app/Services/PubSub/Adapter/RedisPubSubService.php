<?php

declare(strict_types=1);

namespace App\Services\PubSub\Adapter;

use App\Services\PubSub\Interfaces\PubSubInterface;
use Illuminate\Support\Facades\Log;
use Redis;
use RedisException;

final class RedisPubSubService implements PubSubInterface
{
    public function __construct(private readonly Redis $redis) {}

    public function publish(string $channel, string $message): void
    {
        $this->redis->publish($channel, $message);
    }

    public function subscribe(array $channels, callable $callback): void
    {
        try {
            $this->redis->subscribe($channels, $callback);
        } catch (RedisException $e) {
            Log::error($e->getMessage());
        }
    }
}
