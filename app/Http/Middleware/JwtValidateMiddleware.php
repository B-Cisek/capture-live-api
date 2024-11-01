<?php

namespace App\Http\Middleware;

use App\Services\Jwt\Interfaces\JwtBlacklist;
use App\Services\Jwt\Interfaces\JwtProvider;
use Closure;
use Illuminate\Http\Request;
use Lcobucci\JWT\Token\RegisteredClaims;
use Symfony\Component\HttpFoundation\Response;

class JwtValidateMiddleware
{
    public function __construct(
        private readonly JwtProvider $jwtProvider,
        private readonly JwtBlacklist $jwtBlacklist
    ){}

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json(['message' => 'Token missing.'], 401);
        }

        try {
            $tokenObject = $this->jwtProvider->parse($token);
            $request->request->set('userId', $tokenObject->claims()->get(RegisteredClaims::SUBJECT));
        } catch (\Exception) {
            return response()->json(['message' => 'Token invalid.'], 401);
        }

        if ($this->jwtBlacklist->isBlacklisted($token)) {
            return response()->json(['message' => 'Token blacklisted.'], 401);
        }

        return $next($request);
    }
}
