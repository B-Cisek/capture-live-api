<?php

declare(strict_types=1);

namespace App\Repositories\Stream;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface StreamRepositoryInterface
{
    public function getByUserPaginate(string $userId, int $pages = 10): LengthAwarePaginator;
}
