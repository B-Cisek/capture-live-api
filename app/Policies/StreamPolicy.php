<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Stream;
use App\Models\User;

final class StreamPolicy
{
    public function show(?User $user, Stream $stream, ?string $userId): bool
    {
        return $userId === $stream->user_id;
    }

    public function update(?User $user, Stream $stream, ?string $userId): bool
    {
        return $userId === $stream->user_id;
    }

    public function destroy(?User $user, Stream $stream, ?string $userId): bool
    {
        return $userId === $stream->user_id;
    }
}
