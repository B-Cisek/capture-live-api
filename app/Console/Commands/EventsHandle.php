<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;

final class EventsHandle extends Command
{
    protected $signature = 'event:handle';
    protected $description = 'Handle events from node app';

    public function handle(): void {}
}
