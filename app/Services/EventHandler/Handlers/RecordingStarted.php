<?php

namespace App\Services\EventHandler\Handlers;

use App\Services\EventHandler\Interfaces\Event;

final class RecordingStarted implements Event
{
    public function __invoke(array $data): void
    {
        \App\Events\RecordingStarted::dispatch($data);
    }
}
