<?php

declare(strict_types=1);

namespace App\Services\Jwt\Exception;

use App\Exceptions\ApiException;
use Symfony\Component\HttpFoundation\Response;

final class TokenExpiredException extends ApiException
{
    protected $message = 'Token has expired';
    protected $code = Response::HTTP_UNAUTHORIZED;
}
