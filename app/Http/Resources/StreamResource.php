<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class StreamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'platform' => $this->platform,
            'startAt' => $this->start_at,
            'endAt' => $this->end_at,
            'isActive' => $this->is_active,
            'status' => $this->status,
        ];
    }
}
