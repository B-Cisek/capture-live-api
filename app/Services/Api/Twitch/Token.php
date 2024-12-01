<?php

declare(strict_types=1);

namespace App\Services\Api\Twitch;

use App\Enums\Setting;
use Illuminate\Support\Facades\Http;

trait Token
{
    protected function getToken(): string
    {
        $token = $this->stream
            ->user
            ->settings()
            ->where('name', Setting::TWITCH_TOKEN)
            ->first();

        if (!$token) {
            $token = $this->getAccessToken();
            $this->setToken($token);
        } else {
            $token = $token->value;
        }

        return $token;
    }

    private function setToken(string $token): void
    {
        \App\Models\Setting::query()->updateOrInsert(
            [
                'name' => Setting::TWITCH_TOKEN,
                'user_id' => $this->stream->user->id,
            ],
            [
                'value' => $token,
            ],
        );
    }

    private function getAccessToken(): string
    {
        $response = Http::withQueryParameters([
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'grant_type' => 'client_credentials',
        ])->post(self::AUTH_URL);

        return $response->json('access_token');
    }
}
