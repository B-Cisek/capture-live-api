<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Services\Jwt\Exception\TokenBlacklistedException;
use App\Services\Jwt\Exception\TokenExpiredException;
use App\Services\Jwt\Exception\TokenInvalidException;
use App\Services\Jwt\Exception\TokenMissingException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Config;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

final class ApiExceptionHandler
{
    private array $apiExceptions = [
        TokenMissingException::class,
        TokenInvalidException::class,
        TokenBlacklistedException::class,
        TokenExpiredException::class,
    ];

    public function render(Throwable $exception): ?JsonResponse
    {
        foreach ($this->apiExceptions as $exceptionClass) {
            if ($exception instanceof $exceptionClass) {
                return $this->jsonResponse($exception);
            }
        }

        if ($exception instanceof ValidationException) {
            return new JsonResponse([
                'message' => 'VALIDATION_ERROR',
                'errors' => $exception->errors(),
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($exception instanceof HttpExceptionInterface) {
            return new JsonResponse([
                'message' => $exception->getMessage(),
            ], $exception->getStatusCode());
        }

        if (! Config::get('app.debug')) {
            return new JsonResponse([
                'message' => 'A Error Occurred',
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        return null;
    }
    /**
     * Create a JSON response for standard API exceptions
     */
    private function jsonResponse(Throwable $exception): JsonResponse
    {
        return new JsonResponse([
            'message' => $exception->getMessage(),
            'code' => $exception->getCode(),
        ], $this->getHttpStatusCode($exception));
    }

    /**
     * Get appropriate HTTP status code for exception
     */
    private function getHttpStatusCode(Throwable $exception): int
    {
        return match (true) {
            $exception instanceof TokenMissingException => JsonResponse::HTTP_UNAUTHORIZED,
            $exception instanceof TokenInvalidException => JsonResponse::HTTP_UNAUTHORIZED,
            $exception instanceof TokenBlacklistedException => JsonResponse::HTTP_UNAUTHORIZED,
            $exception instanceof TokenExpiredException => JsonResponse::HTTP_UNAUTHORIZED,
            default => 500,
        };
    }
}
