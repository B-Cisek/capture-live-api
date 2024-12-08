<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

final class RecordingStopped
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(private array $data)
    {
        Log::info('RecordingStopped event fired');
    }
}
