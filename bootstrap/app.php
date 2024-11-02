<?php

use App\Http\Middleware\EnsureJsonResponse;
use App\Http\Middleware\JwtValidateMiddleware;
use App\Services\Jwt\Exception\TokenMissingException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->prependToGroup('jwt', JwtValidateMiddleware::class);
        $middleware->api(EnsureJsonResponse::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Exception $exception, Request $request) {

            if ($exception instanceof TokenMissingException) {
                return response()->json(
                    data: ['message' => $exception->getMessage()],
                    status: $exception->getCode()
                );
            }

            if ($exception instanceof \App\Services\Jwt\Exception\TokenInvalidException) {
                return response()->json(
                    data: ['message' => $exception->getMessage()],
                    status: $exception->getCode()
                );
            }

            if ($exception instanceof \App\Services\Jwt\Exception\TokenBlacklistedException) {
                return response()->json(
                    data: ['message' => $exception->getMessage()],
                    status: $exception->getCode()
                );
            }
        });
    })->create();
