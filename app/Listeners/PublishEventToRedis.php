<?php

declare(strict_types=1);

namespace App\Listeners;

use App\DTO\RecordStream;
use App\Events\StartRecording;
use App\Services\PubSub\Interfaces\PubSubInterface;
use Illuminate\Support\Facades\Log;
use JsonException;

final readonly class PublishEventToRedis
{
    public function __construct(private PubSubInterface $pubSub) {}

    /**
     * @throws JsonException
     */
    public function handle(StartRecording $event): void
    {
        $recordStream = RecordStream::fromStream($event->stream);

        Log::log('info', json_encode($recordStream->toArray(), JSON_THROW_ON_ERROR));
        $this->pubSub->publish(PubSubInterface::RECORDING_CHANNEL, json_encode($recordStream->toArray(), JSON_THROW_ON_ERROR));
    }
}
