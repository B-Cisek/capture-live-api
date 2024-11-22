<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schedule;

Schedule::job(App\Jobs\RemoveExpiredTokens::class)->hourly();
Schedule::job(App\Jobs\CheckStreamStatus::class)->everySecond();
Schedule::command(App\Console\Commands\EventsHandle::class)->everySecond();
