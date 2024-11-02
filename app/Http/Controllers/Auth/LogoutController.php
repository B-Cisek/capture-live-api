<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Jwt\Interfaces\JwtBlacklist;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class LogoutController extends Controller
{
    public function __construct(
        private readonly JwtBlacklist $jwtBlacklist,
        private readonly ResponseFactory $response,
    ) {}

    public function __invoke(Request $request): Response
    {
        $token = $request->bearerToken();

        $this->jwtBlacklist->blacklist($token);

        return $this->response->noContent();
    }
}
