<?php

namespace Tests\Unit\Jwt;

use App\Services\Jwt\Concrete\JwtProvider;
use App\Services\Jwt\Interfaces\JwtProvider as JwtProviderContract;
use Illuminate\Support\Facades\Config;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Token\RegisteredClaims;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use Ramsey\Uuid\Uuid;
use Random\Randomizer;
use Lcobucci\JWT\Token;

class JwtProviderTest extends TestCase
{
    private JwtProviderContract $jwtProvider;
    private string $userId;
    private array $claims;
    private array $headers;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userId = Uuid::uuid4()->toString();
        $this->claims = ['email' => 'test@app.com'];
        $this->headers = ['foo' => 'bar'];

        Config::set('app.url', 'http://localhost');
        Config::set('jwt.exp', 5);
        Config::set('jwt.secret', base64_encode(bin2hex((new Randomizer())->getBytes(32))));

        $configuration = Configuration::forSymmetricSigner(
            new \Lcobucci\JWT\Signer\Hmac\Sha512(),
            \Lcobucci\JWT\Signer\Key\InMemory::base64Encoded(Config::get('jwt.secret'))
        );

        $this->jwtProvider = new JwtProvider($configuration);
    }

    #[Test]
    public function it_should_issue_token_successfully(): void
    {
        $token = $this->jwtProvider->issue($this->userId, $this->claims, $this->headers);

        $this->assertIsString($token);
        $this->assertNotEmpty($token);
    }

    #[Test]
    public function it_should_parse_token_successfully(): void
    {
        $token = $this->jwtProvider->issue($this->userId, $this->claims, $this->headers);
        $parsedToken = $this->jwtProvider->parse($token);

        $this->assertInstanceOf(Token::class, $parsedToken);
    }

    #[Test]
    public function it_should_contain_valid_claims_and_headers(): void
    {
        $token = $this->jwtProvider->issue($this->userId, $this->claims, $this->headers);
        $parsedToken = $this->jwtProvider->parse($token);

        $this->assertEquals($this->userId, $parsedToken->claims()->get(RegisteredClaims::SUBJECT));
        $this->assertEquals($this->claims['email'], $parsedToken->claims()->get('email'));
        $this->assertEquals(Config::get('app.url'), $parsedToken->claims()->get(RegisteredClaims::ISSUER));
        $this->assertEquals(
            (new \DateTimeImmutable())->modify('+5 days')->format('Y-m-d'),
            $parsedToken->claims()->get(RegisteredClaims::EXPIRATION_TIME)->format('Y-m-d')
        );
        $this->assertEquals($this->headers['foo'], $parsedToken->headers()->get('foo'));
    }

    #[Test]
    public function it_should_fail_with_expired_token(): void
    {
        Config::set('jwt.exp', 0);

        $token = $this->jwtProvider->issue($this->userId, $this->claims, $this->headers);
        $parsedToken = $this->jwtProvider->parse($token);

        $this->assertTrue($parsedToken->isExpired(new \DateTimeImmutable()));
    }
}
