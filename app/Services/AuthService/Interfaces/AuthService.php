<?php

declare(strict_types=1);

namespace App\Services\AuthService\Interfaces;

use App\Http\Requests\SignInRequest;
use App\Http\Requests\SignUpRequest;
use App\Models\User;

interface AuthService
{
    public function signup(SignUpRequest $request): User;
    public function signin(SignInRequest $request): User;
}
