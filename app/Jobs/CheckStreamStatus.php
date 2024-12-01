<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\RecordingStatus;
use App\Events\StartRecording;
use App\Models\Stream;
use App\Services\Api\Twitch\TwitchApi;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

final class CheckStreamStatus
{
    private Stream $stream;

    public function __invoke(): void
    {
        $streams = Stream::query()->with('user.settings')->get();

        $streams->each(function (Stream $stream): void {
            $this->stream = $stream;

            if ($this->isReadyToRecord()) {
                StartRecording::dispatch($this->stream);
            }
        });
    }

    private function isReadyToRecord(): bool
    {
        return
            $this->isActive() &&
            $this->isStatusReady() &&
            $this->isDatesValid() &&
            $this->isChannelLive();
    }

    private function isActive(): bool
    {
        return $this->stream->is_active;
    }

    private function isStatusReady(): bool
    {
        return RecordingStatus::READY === $this->stream->status;
    }

    private function isChannelLive(): bool
    {
        try {
            return (new TwitchApi($this->stream))->isChannelLive();
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return false;
        }
    }

    private function isDatesValid(): bool
    {
        $startAt = $this->stream->start_at;
        $endAt = $this->stream->end_at;

        if (null === $startAt && null === $endAt) {
            return true;
        }

        return Carbon::now()->between($startAt, $endAt);
    }
}
