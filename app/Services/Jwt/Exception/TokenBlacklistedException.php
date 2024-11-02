<?php

namespace App\Services\Jwt\Exception;

use Symfony\Component\HttpFoundation\Response;

class TokenBlacklistedException extends \Exception
{
    protected $message = 'Token is blacklisted';
    protected $code = Response::HTTP_UNAUTHORIZED;
}
