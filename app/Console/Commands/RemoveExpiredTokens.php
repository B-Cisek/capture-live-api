<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Repositories\BlackListedToken\BlackListedTokenRepositoryInterface;
use Illuminate\Console\Command;

final class RemoveExpiredTokens extends Command
{
    protected $signature = 'app:remove-expired-tokens';
    protected $description = 'Command description';

    public function handle(BlackListedTokenRepositoryInterface $repository): void
    {
        $repository->deleteExpiredTokens();
    }
}
