<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\MeController;
use App\Http\Controllers\Auth\SignInController;
use App\Http\Controllers\Auth\SignUpController;
use App\Http\Controllers\Setting\SettingController;
use App\Http\Controllers\Stream\StreamController;
use Illuminate\Support\Facades\Route;

Route::post('/signup', SignUpController::class);
Route::post('/signin', SignInController::class);

Route::middleware('jwt')->group(function (): void {
    Route::post('/logout', LogoutController::class);
    Route::get('/me', MeController::class);
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'store']);
    Route::delete('/streams/batch', [StreamController::class, 'batchDestroy']);
    Route::apiResource('/streams', StreamController::class);
});
