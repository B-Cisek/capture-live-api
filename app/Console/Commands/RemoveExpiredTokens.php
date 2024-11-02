<?php

namespace App\Console\Commands;

use App\Repositories\BlackListedToken\BlackListedTokenRepositoryInterface;
use Illuminate\Console\Command;

class RemoveExpiredTokens extends Command
{
    protected $signature = 'app:remove-expired-tokens';
    protected $description = 'Command description';

    public function handle(BlackListedTokenRepositoryInterface $repository): void
    {
        $repository->deleteExpiredTokens();
    }
}
