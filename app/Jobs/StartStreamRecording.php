<?php

declare(strict_types=1);

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class StartStreamRecording implements ShouldQueue
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(private string $username) {}

    public function __serialize(): array
    {
        return [
            'username' => $this->username,
        ];
    }
}
