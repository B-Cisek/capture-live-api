<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class ApiException extends Exception
{
    protected $message = 'An Error Occurred';
    protected $code = JsonResponse::HTTP_INTERNAL_SERVER_ERROR;

    public function render(): JsonResponse
    {
        return new JsonResponse([
            'error' => $this->getMessage()
        ], $this->getCode());
    }
}
