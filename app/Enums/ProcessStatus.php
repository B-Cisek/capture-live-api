<?php

declare(strict_types=1);

namespace App\Enums;

use App\Helpers\EnumHelper;

enum ProcessStatus: string
{
    use EnumHelper;

    case RUNNING = 'running';
    case FAILED = 'failed';
    case SUCCESS = 'success';
    case STOPPED = 'stopped';
}
