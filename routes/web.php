<?php

declare(strict_types=1);

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => new JsonResponse([
    'APP_VERSION' => '0.0.1',
    'PHP_VERSION' => PHP_VERSION,
]));
