<?php

declare(strict_types=1);

namespace App\DTO;

use App\Models\Stream;
use DateTimeImmutable;

final readonly class RecordStream
{
    public function __construct(
        public string $channel,
        public string $platform,
        public string $quality,
        public ?DateTimeImmutable $startAt = null,
        public ?DateTimeImmutable $endAt = null,
    ) {}

    public static function fromStream(Stream $stream): RecordStream
    {
        return new self(
            $stream->channel,
            $stream->platform->name,
            $stream->quality,
            $stream->start_at,
            $stream->end_at,
        );
    }

    public function toArray(): array
    {
        return [
            'channel' => $this->channel,
            'platform' => $this->platform,
            'quality' => $this->quality,
            'start_at' => $this->startAt?->format(DATE_ATOM),
            'end_at' => $this->endAt?->format(DATE_ATOM),
        ];
    }
}
