<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Repositories\BlackListedToken\BlackListedTokenRepositoryInterface;

final class RemoveExpiredTokens
{
    public function __invoke(BlackListedTokenRepositoryInterface $repository): void
    {
        $repository->deleteExpiredTokens();
    }
}
