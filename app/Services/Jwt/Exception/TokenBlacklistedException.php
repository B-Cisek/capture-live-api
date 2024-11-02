<?php

declare(strict_types=1);

namespace App\Services\Jwt\Exception;

use Exception;
use Symfony\Component\HttpFoundation\Response;

final class TokenBlacklistedException extends Exception
{
    protected $message = 'Token is blacklisted';
    protected $code = Response::HTTP_UNAUTHORIZED;
}
