<?php

declare(strict_types=1);

namespace App\Enums;

use App\Helpers\EnumHelper;

enum Setting: string
{
    use EnumHelper;

    case TWITCH_CLIENT_ID = 'TWITCH_CLIENT_ID';
    case TWITCH_SECRET_KEY = 'TWITCH_SECRET_KEY';
    case TWITCH_TOKEN = 'TWITCH_TOKEN';
    case TWITCH_QUALITY = 'TWITCH_QUALITY';
    case TWITCH_SKIP_ADS = 'TWITCH_SKIP_ADS';
}
