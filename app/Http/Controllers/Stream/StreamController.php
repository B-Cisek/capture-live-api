<?php

declare(strict_types=1);

namespace App\Http\Controllers\Stream;

use App\Helpers\CurrentUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStreamRequest;
use App\Http\Requests\UpdateStreamRequest;
use App\Http\Resources\StreamCollection;
use App\Http\Resources\StreamResource;
use App\Models\Stream;
use App\Models\User;
use App\Repositories\Stream\StreamRepositoryInterface;
use Illuminate\Contracts\Auth\Access\Gate;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

final class StreamController extends Controller
{
    public function __construct(
        private readonly ResponseFactory $response,
        private readonly StreamRepositoryInterface $repository,
        private readonly Gate $gate,
    ) {}

    public function index(#[CurrentUser] User $user): JsonResponse
    {
        $streams = $this->repository->getByUserPaginate($user->id);

        return $this->response->json(new StreamCollection($streams));
    }

    public function store(StoreStreamRequest $request): JsonResponse
    {
        $attributes = $request->validated();
        $attributes['user_id'] = $request->user()->id;

        $stream = new Stream($attributes);
        $stream->save();

        return $this->response->json(StreamResource::make($stream), JsonResponse::HTTP_CREATED);
    }

    public function show(Stream $stream, #[CurrentUser] User $user): JsonResponse
    {
        $this->gate->authorize(__FUNCTION__, [$stream, $user->id]);

        return $this->response->json(StreamResource::make($stream));
    }

    public function update(UpdateStreamRequest $request, Stream $stream): JsonResponse
    {
        $this->gate->authorize(__FUNCTION__, [$stream, $request->user()->id]);

        $stream
            ->fill($request->validated())
            ->update();

        return $this->response->json(StreamResource::make($stream));
    }

    public function destroy(Stream $stream, #[CurrentUser] User $user): Response
    {
        $this->gate->authorize(__FUNCTION__, [$stream, $user->id]);

        $stream->delete();

        return $this->response->noContent();
    }
}
