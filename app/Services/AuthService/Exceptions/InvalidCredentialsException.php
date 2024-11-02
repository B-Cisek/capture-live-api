<?php

declare(strict_types=1);

namespace App\Services\AuthService\Exceptions;

use Exception;

final class InvalidCredentialsException extends Exception
{
    protected $message = 'Invalid credentials';
}
