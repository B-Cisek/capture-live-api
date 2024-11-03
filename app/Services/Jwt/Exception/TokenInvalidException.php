<?php

declare(strict_types=1);

namespace App\Services\Jwt\Exception;

use App\Exceptions\ApiException;
use Symfony\Component\HttpFoundation\Response;

final class TokenInvalidException extends ApiException
{
    protected $message = 'Token is invalid';
    protected $code = Response::HTTP_UNAUTHORIZED;
}
