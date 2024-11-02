<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Helpers\CurrentUser;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;

final class MeController extends Controller
{
    public function __construct(
        private readonly ResponseFactory $response,
    ) {}

    public function __invoke(#[CurrentUser] User $user): JsonResponse
    {
        $user = User::find($user->id);

        return $this->response->json(UserResource::make($user));
    }
}
