<?php

namespace App\Repositories\BlackListedToken;

use DateTimeInterface;

interface BlackListedTokenRepositoryInterface
{
    public function blacklistToken(string $tokenId, DateTimeInterface $expiredAt): void;
    public function deleteExpiredTokens(): void;
    public function isBlacklisted(string $tokenId): bool;
    public function removeToken(string $tokenId): bool;
}
