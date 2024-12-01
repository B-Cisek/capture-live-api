<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\StartRecording;

class SetInProgressStatus
{
    public function handle(StartRecording $event): void
    {
        $event->stream->startRecording();
    }
}
