<?php

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => new JsonResponse([
    'version' => '0.0.1',
    'phpVersion' => phpversion(),
]));
