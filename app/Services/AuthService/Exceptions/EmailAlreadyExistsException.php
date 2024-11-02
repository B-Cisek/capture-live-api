<?php

namespace App\Services\AuthService\Exceptions;

use Exception;

class EmailAlreadyExistsException extends Exception
{
    protected $message = 'Email already exists in the system';
}
