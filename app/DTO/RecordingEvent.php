<?php

declare(strict_types=1);

namespace App\DTO;

use App\Services\EventHandler\Enum\Event;
use DateTimeImmutable;

final readonly class RecordingEvent
{
    public function __construct(
        public Event $event,
        public string $channelName,
        public DateTimeImmutable $timestamp,
    ) {}

    public static function fromJson(string $json): RecordingEvent
    {
        $data = json_decode($json);

        return new self(
            Event::from($data->event),
            $data->channelName,
            DateTimeImmutable::createFromFormat(DATE_ATOM, $data->timestamp),
        );
    }
}
