<?php

declare(strict_types=1);

namespace App\Services\AuthService\Exceptions;

use App\Exceptions\ApiException;
use Symfony\Component\HttpFoundation\Response;

final class EmailAlreadyExistsException extends ApiException
{
    protected $message = 'Email already exists in the system';
    protected $code = Response::HTTP_UNAUTHORIZED;
}
