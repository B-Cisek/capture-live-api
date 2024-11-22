<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\RecordingStatus;
use App\Models\Stream;
use App\Services\Api\Twitch\TwitchApi;
use App\Services\PubSub\Interfaces\PubSubInterface;
use Illuminate\Support\Carbon;

final class CheckStreamStatus
{
    private Stream $stream;

    public function __construct(private readonly PubSubInterface $pubSub) {}

    public function __invoke(): void
    {
        $streams = Stream::query()->with('user.settings')->get();

        $streams->each(function (Stream $stream): void {
            $this->stream = $stream;

            if ($this->isReadyToRecord()) {
                $this->pubSub->publish(PubSubInterface::RECORDING_CHANNEL, $this->stream->toJson());
            }
        });
    }

    private function isReadyToRecord(): bool
    {
        return
            $this->isActive() &&
            $this->isStatusReady() &&
            $this->isDatesValid() &&
            $this->isUserLive();
    }

    private function isActive(): bool
    {
        return $this->stream->is_active;
    }

    private function isStatusReady(): bool
    {
        return RecordingStatus::READY === $this->stream->status;
    }

    private function isUserLive(): bool
    {
        return (new TwitchApi($this->stream))->isUserLive($this->stream->username);
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
