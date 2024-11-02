<?php

namespace App\Services\Jwt\Exception;

use Symfony\Component\HttpFoundation\Response;

class TokenMissingException extends \Exception
{
    protected $message = 'Token is missing';
    protected $code = Response::HTTP_BAD_REQUEST;
}
