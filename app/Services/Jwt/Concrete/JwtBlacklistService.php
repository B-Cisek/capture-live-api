<?php

namespace App\Services\Jwt\Concrete;

use App\Repositories\BlackListedToken\BlackListedTokenRepositoryInterface;
use App\Services\Jwt\Interfaces\JwtBlacklist;
use App\Services\Jwt\Interfaces\JwtProvider;
use Lcobucci\JWT\Token\RegisteredClaims;
use DateTimeInterface;

readonly final class JwtBlacklistService implements JwtBlacklist
{
    public function __construct(
        private JwtProvider $jwtProvider,
        private BlackListedTokenRepositoryInterface $repository
    ){}

    public function blacklist(string $token): void
    {
        $claims = $this->jwtProvider->parse($token)->claims();

        /** @var DateTimeInterface $expireDate */
        $expireDate = $claims->get(RegisteredClaims::EXPIRATION_TIME);
        $tokenId = $claims->get(RegisteredClaims::ID);

        $this->repository->blacklistToken($tokenId, $expireDate);
    }

    public function isBlacklisted(string $token): bool
    {
        $claims = $this->jwtProvider->parse($token)->claims();

        $tokenId = $claims->get(RegisteredClaims::ID);

        return $this->repository->isBlacklisted($tokenId);
    }

    public function removeToken(string $token): bool
    {
        return $this->repository->removeToken($token);
    }
}
