<?php

declare(strict_types=1);

namespace App\Helpers;

use Attribute;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Container\ContextualAttribute;

#[Attribute(Attribute::TARGET_PARAMETER)]
final class CurrentUser implements ContextualAttribute
{
    public static function resolve(self $attribute, Container $container)
    {
        return $container->make('request')->user();
    }
}
