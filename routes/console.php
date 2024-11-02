<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schedule;

Schedule::command(App\Console\Commands\RemoveExpiredTokens::class)->hourly();
