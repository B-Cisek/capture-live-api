<?php

namespace App\Services\Jwt\Exception;

use Symfony\Component\HttpFoundation\Response;

class TokenInvalidException extends \Exception
{
    protected $message = 'Token is invalid';
    protected $code = Response::HTTP_UNAUTHORIZED;
}
