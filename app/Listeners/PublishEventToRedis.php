<?php

declare(strict_types=1);

namespace App\Listeners;

use App\DTO\RecordStream;
use App\Events\StartRecording;
use App\Services\PubSub\Interfaces\PubSubInterface;
<<<<<<< Updated upstream
use Illuminate\Support\Facades\Log;
use JsonException;
=======
>>>>>>> Stashed changes

final readonly class PublishEventToRedis
{
    public function __construct(private PubSubInterface $pubSub) {}

    /**
     * @throws JsonException
     */
    public function handle(StartRecording $event): void
    {
        $recordStream = RecordStream::fromStream($event->stream);

        $this->pubSub->publish(PubSubInterface::RECORDING_CHANNEL, json_encode($recordStream->toArray(), JSON_THROW_ON_ERROR));
    }
}
