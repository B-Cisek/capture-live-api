<?php

namespace App\Services\Jwt\Interfaces;

use Lcobucci\JWT\Token;

interface JwtProvider
{
    public function issue(string $userId, array $claims = [], array $headers = []): string;
    public function parse(string $token): Token;
}
