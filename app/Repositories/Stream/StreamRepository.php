<?php

declare(strict_types=1);

namespace App\Repositories\Stream;

use App\Models\Stream;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StreamRepository implements StreamRepositoryInterface
{
    public function getByUserPaginate(string $userId, int $pages = 10): LengthAwarePaginator
    {
        return Stream::query()
            ->where('user_id', $userId)
            ->paginate($pages);
    }
}
