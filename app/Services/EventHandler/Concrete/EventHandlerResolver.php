<?php

namespace App\Services\EventHandler\Concrete;

use App\Services\EventHandler\Enum\Event;
use App\Services\EventHandler\Handlers\RecordingStarted;
use App\Services\EventHandler\Handlers\RecordingStopped;

final class EventHandlerResolver
{
    public static function resolve(string $eventName): string
    {
        return match ($eventName) {
            Event::RECORDING_STARTED->value => RecordingStarted::class,
            Event::RECORDING_STOPPED->value => RecordingStopped::class,
            default => throw new \Exception('Invalid Event Name'),
        };
    }
}
