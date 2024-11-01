<?php

namespace App\Enums;

use App\Helpers\EnumHelper;

enum RecordingStatus: string
{
    use EnumHelper;

    case READY = 'ready';
    case IN_PROGRESS = 'in_progress';
}
