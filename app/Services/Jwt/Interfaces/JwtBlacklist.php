<?php

namespace App\Services\Jwt\Interfaces;

interface JwtBlacklist
{
    public function blacklist(string $token): void;
    public function isBlacklisted(string $token): bool;
    public function removeToken(string $token): bool;
}
