<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Random\Randomizer;

class GenerateSecretKey extends Command
{
    protected $signature = 'jwt:generate-secret-key';
    protected $description = 'Generate secret key';

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
