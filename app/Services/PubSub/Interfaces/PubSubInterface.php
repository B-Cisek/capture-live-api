<?php

declare(strict_types=1);

namespace App\Services\PubSub\Interfaces;

interface PubSubInterface
{
    public const string RECORDING_CHANNEL = 'recording';
    public const string RECORDING_EVENTS_CHANNEL = 'recording-events';

    public function publish(string $channel, string $message): void;
    public function subscribe(array $channels, callable $callback): void;
}
