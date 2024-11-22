<?php

declare(strict_types=1);

namespace App\Services\AuthService\Exceptions;

use App\Exceptions\ApiException;
use Symfony\Component\HttpFoundation\Response;

final class InvalidCredentialsException extends ApiException
{
    protected $message = 'Invalid credentials';
    protected $code = Response::HTTP_UNAUTHORIZED;
}
