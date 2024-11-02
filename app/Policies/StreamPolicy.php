<?php

namespace App\Policies;

use App\Models\Stream;
use App\Models\User;

class StreamPolicy
{
    public function show(?User $user, Stream $stream, ?string $userId): bool
    {
        return $userId === $stream->user_id;
    }

    public function update(?User $user, Stream $stream, ?string $userId): bool
    {
        return $userId === $stream->user_id;
    }
}
