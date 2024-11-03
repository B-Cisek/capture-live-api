<?php

declare(strict_types=1);

namespace App\Services\Jwt\Exception;

use App\Exceptions\ApiException;
use Symfony\Component\HttpFoundation\Response;

final class TokenMissingException extends ApiException
{
    protected $message = 'Token is missing';
    protected $code = Response::HTTP_BAD_REQUEST;
}
