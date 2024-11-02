<?php

namespace App\Services\AuthService\Exceptions;

class InvalidCredentialsException extends \Exception
{
    protected $message = 'Invalid credentials';
}
