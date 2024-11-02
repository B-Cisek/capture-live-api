<?php

namespace App\Helpers;

use Illuminate\Contracts\Container\ContextualAttribute;
use Illuminate\Contracts\Container\Container;
use Attribute;

#[Attribute(Attribute::TARGET_PARAMETER)]
class CurrentUser implements ContextualAttribute
{
    public static function resolve(self $attribute, Container $container)
    {
        return $container->make('request')->user();
    }
}
