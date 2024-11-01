<?php

namespace App\Helpers;

trait EnumHelper
{
    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }
}
