<?php

declare(strict_types=1);

namespace App\Services\Jwt\Concrete;

use App\Services\Jwt\Interfaces\JwtProvider as JwtProviderContract;
use DateTimeImmutable;
use Illuminate\Support\Facades\Config;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Encoding\CannotDecodeContent;
use Lcobucci\JWT\Token;
use Lcobucci\JWT\Token\InvalidTokenStructure;
use Lcobucci\JWT\Token\UnsupportedHeaderFound;
use Ramsey\Uuid\Uuid;

final readonly class JwtProvider implements JwtProviderContract
{
    public function __construct(private Configuration $configuration) {}

    public function issue(string $userId, array $claims = [], array $headers = []): string
    {
        $now = new DateTimeImmutable();

        $builder = $this->configuration->builder()
            ->issuedBy(Config::get('app.url'))
            ->identifiedBy(Uuid::uuid4()->toString())
            ->relatedTo($userId)
            ->expiresAt($now->modify('+' . Config::get('jwt.exp') . ' days'));

        foreach ($claims as $key => $value) {
            $builder = $builder->withClaim($key, $value);
        }

        foreach ($headers as $key => $value) {
            $builder = $builder->withHeader($key, $value);
        }

        return $builder
            ->getToken($this->configuration->signer(), $this->configuration->signingKey())
            ->toString();
    }

    /**
     * @throws CannotDecodeContent
     * @throws InvalidTokenStructure
     * @throws UnsupportedHeaderFound
     */
    public function parse(string $token): Token
    {
        return $this->configuration->parser()->parse($token);
    }
}
