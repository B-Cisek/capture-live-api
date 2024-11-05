<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\Jwt\Exception\TokenBlacklistedException;
use App\Services\Jwt\Exception\TokenExpiredException;
use App\Services\Jwt\Exception\TokenInvalidException;
use App\Services\Jwt\Exception\TokenMissingException;
use App\Services\Jwt\Interfaces\JwtBlacklist;
use App\Services\Jwt\Interfaces\JwtProvider;
use Closure;
use DateTimeImmutable;
use DateTimeZone;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Lcobucci\JWT\Token\RegisteredClaims;
use Symfony\Component\HttpFoundation\Response;

final class JwtValidateMiddleware
{
    public function __construct(
        private readonly JwtProvider $jwtProvider,
        private readonly JwtBlacklist $jwtBlacklist,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        $tokenObject = null;

        if (! $token) {
            throw new TokenMissingException();
        }

        try {
            $tokenObject = $this->jwtProvider->parse($token);
        } catch (Exception) {
            throw new TokenInvalidException();
        }

        if ($tokenObject->isExpired(new DateTimeImmutable())) {
            throw new TokenExpiredException();
        }

        $user = (new User())->newQuery()->find($tokenObject->claims()->get(RegisteredClaims::SUBJECT));

        if (null === $user) {
            throw new TokenInvalidException();
        }

        if ($this->jwtBlacklist->isBlacklisted($token)) {
            throw new TokenBlacklistedException();
        }

        $request->setUserResolver(fn() => $user);

        return $next($request);
    }
}
