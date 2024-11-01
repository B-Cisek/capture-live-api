<?php

namespace App\Console\Commands;

use App\Repositories\BlackListedToken\BlackListedTokenRepositoryInterface;
use Illuminate\Console\Command;

class RemoveExpiredTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:remove-expired-tokens';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    public function handle(BlackListedTokenRepositoryInterface $repository): void
    {
        $repository->deleteExpiredTokens();
    }
}
