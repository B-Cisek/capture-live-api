<?php

namespace App\Services\EventHandler\Handlers;

use App\Services\EventHandler\Interfaces\Event;

final class RecordingStopped implements Event
{
    public function __invoke(array $data): void
    {
        \App\Events\RecordingStopped::dispatch($data);
    }
}
