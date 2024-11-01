<?php

use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\SignInController;
use App\Http\Controllers\Auth\MeController;
use App\Http\Controllers\Auth\SignUpController;
use Illuminate\Support\Facades\Route;

Route::post('/signup', SignUpController::class);
Route::post('/signin', SignInController::class);

Route::middleware('jwt')->group(function () {
    Route::post('/logout', LogoutController::class);
    Route::get('/me', MeController::class);
});
