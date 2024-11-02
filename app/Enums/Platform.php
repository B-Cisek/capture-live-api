<?php

declare(strict_types=1);

namespace App\Enums;

use App\Helpers\EnumHelper;

enum Platform: string
{
    use EnumHelper;

    case TWITCH = 'twitch';
    //    case KICK = 'kick';
    //    case YOUTUBE = 'youTube';
}
