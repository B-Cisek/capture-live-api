<?php

namespace App\Services\EventHandler\Concrete;

use App\Services\EventHandler\Interfaces\Event;
use App\Services\EventHandler\Interfaces\EventHandler as EventHandlerInterface;

class EventHandler implements EventHandlerInterface
{
    public function handle(string $event): void
    {
        $data = $this->decodeJson($event);

        $event = EventHandlerResolver::resolve($data['event']);

        if (! class_exists($event)) {
            throw new \Exception('Handler Not Found');
        }

        if (! is_subclass_of($event, Event::class)) {
            throw new \Exception('Handler Must Implement Event Interface');
        }

        app($event)($data['data']);
    }

    private function decodeJson(string $json): array
    {
        if (! json_validate($json)) {
            throw new \Exception('Invalid Event JSON');
        }

        return json_decode($json, true);
    }
}
