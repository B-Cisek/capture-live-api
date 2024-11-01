<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Random\Randomizer;

class GenerateSecretKey extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jwt:generate-secret-key';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate secret key';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $bytes = (new Randomizer())->getBytes(32);
        $hex = bin2hex($bytes);
        $key = base64_encode($hex);

        $this->info('JWT key generated successfully.');
        $this->info('-------------------------------');
        $this->info($key);
        $this->info('-------------------------------');
    }
}
