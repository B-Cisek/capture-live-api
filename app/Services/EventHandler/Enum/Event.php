<?php

declare(strict_types=1);

namespace App\Services\EventHandler\Enum;

enum Event: string
{
    case RECORDING_STARTED = 'recording-started';
    case RECORDING_STOPPED = 'recording-stopped';
    case RECORDING_ERROR = 'recording-error';
    case RECORDING_COMPLETED = 'recording-completed';
}
