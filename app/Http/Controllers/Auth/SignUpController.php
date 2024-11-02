<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\SignUpRequest;
use App\Services\AuthService\Interfaces\AuthService;
use App\Services\Jwt\Interfaces\JwtProvider;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;

class SignUpController extends Controller
{
    public function __construct(
        private readonly ResponseFactory $response,
        private readonly JwtProvider $jwtProvider,
        private readonly AuthService $auth
    ) {}

    public function __invoke(SignUpRequest $request): JsonResponse
    {
        try {
            $userModel = $this->auth->signup($request);
            $token = $this->jwtProvider->issue($userModel->id, [
                'id' => $userModel->id,
                'email' => $userModel->email
            ]);
            return $this->response->json(['token' => $token]);
        } catch (\Exception $e) {
            return $this->response->json([
                'error' => $e->getMessage(),
            ]);
        }
    }
}
