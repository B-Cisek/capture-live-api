<?php

declare(strict_types=1);

namespace App\Services\Jwt\Exception;

use App\Exceptions\ApiException;
use Symfony\Component\HttpFoundation\Response;

final class TokenBlacklistedException extends ApiException
{
    protected $message = 'Token is blacklisted';
    protected $code = Response::HTTP_UNAUTHORIZED;
}
