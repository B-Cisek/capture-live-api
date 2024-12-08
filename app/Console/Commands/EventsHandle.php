<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\EventHandler\Interfaces\EventHandler;
use App\Services\PubSub\Interfaces\PubSubInterface;
use Illuminate\Console\Command;

final class EventsHandle extends Command
{
    protected $signature = 'event:handle';
    protected $description = 'Handle events from node app';

    public function handle(PubSubInterface $pubSub, EventHandler $handler): void
    {
        $pubSub->subscribe([PubSubInterface::RECORDING_EVENTS_CHANNEL],
            function (\Redis $redis, string $channel, string $message) use ($handler) {
                $handler->handle($message);
            }
        );
    }
}
