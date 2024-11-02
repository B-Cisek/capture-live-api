<?php

declare(strict_types=1);

namespace App\Services\AuthService\Exceptions;

use Exception;

final class EmailAlreadyExistsException extends Exception
{
    protected $message = 'Email already exists in the system';
}
