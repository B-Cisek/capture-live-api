<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Config;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

final class ApiExceptionHandler
{
    public function render(Throwable $exception): ?JsonResponse
    {
        if ($exception instanceof ApiException) {
            return $exception->render();
        }

        if ($exception instanceof ValidationException) {
            return new JsonResponse([
                'error' => true,
                'message' => 'Validation Error',
                'errors' => $exception->errors(),
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($exception instanceof HttpExceptionInterface) {
            return new JsonResponse([
                'error' => true,
                'message' => $exception->getMessage(),
            ], $exception->getStatusCode());
        }

        if (! Config::get('app.debug')) {
            return new JsonResponse([
                'error' => true,
                'message' => 'A Error Occurred'
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return null;
    }
}
