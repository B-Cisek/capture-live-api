<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeController extends Controller
{
    public function __construct(
        private readonly ResponseFactory $response,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $user = User::find($request->get('userId'));

        return $this->response->json(UserResource::make($user));
    }
}
