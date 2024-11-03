<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

abstract class ApiException extends Exception
{
    protected int $statusCode = JsonResponse::HTTP_INTERNAL_SERVER_ERROR;

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function render(): JsonResponse
    {
        return new JsonResponse([
            'message' => $this->getMessage(),
            'code' => $this->getCode(),
        ], $this->getStatusCode());
    }
}
