<?php

declare(strict_types=1);

namespace App\Repositories\BlackListedToken;

use App\Models\BlackListedToken;
use DateTimeInterface;

class BlackListedTokenRepository implements BlackListedTokenRepositoryInterface
{
    public function blacklistToken(string $tokenId, DateTimeInterface $expiredAt): void
    {
        $blackListedToken = new BlackListedToken();
        $blackListedToken->token_id = $tokenId;
        $blackListedToken->expired_at = $expiredAt;
        $blackListedToken->save();
    }

    public function deleteExpiredTokens(): void
    {
        BlackListedToken::query()
            ->where('expired_at', '<=', now())
            ->delete();
    }

    public function isBlacklisted(string $tokenId): bool
    {
        return BlackListedToken::query()
            ->where('token_id', $tokenId)
            ->exists();
    }

    public function removeToken(string $tokenId): bool
    {
        return (bool) BlackListedToken::query()
            ->where('token_id', $tokenId)
            ->delete();
    }
}
