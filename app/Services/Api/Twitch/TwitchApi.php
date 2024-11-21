<?php

declare(strict_types=1);

namespace App\Services\Api\Twitch;

use App\Enums\Setting;
use App\Models\Stream;
use Illuminate\Support\Facades\Http;

/**
 * TODO: Refactor
 */
class TwitchApi
{
    private const string AUTH_URL = 'https://id.twitch.tv/oauth2/token';
    private const string API_URL = 'https://api.twitch.tv/helix';
    private ?string $clientId;
    private ?string $clientSecret;
    private string $token;
    private Stream $stream;

    public function __construct(Stream $stream)
    {
        $this->stream = $stream;

        $this->clientId = $stream->user->settings()->where('name', Setting::TWITCH_CLIENT_ID)?->first()->value;
        $this->clientSecret = $stream->user->settings()->where('name', Setting::TWITCH_SECRET_KEY)?->first()->value;
        $this->token = $this->getToken();
    }

    public function isUserLive(string $username): bool
    {
        $response = Http::withToken($this->token)
            ->withHeaders([
                'Client-Id' => $this->clientId
            ])
            ->withQueryParameters([
                'user_login' => $username
            ])
            ->get(self::API_URL . '/streams');

        $data = $response->json('data');

        if (empty($data)) {
            return false;
        }

        if ($data[0]['type'] === 'live') {
            return true;
        }

        return false;
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

    private function getToken(): string
    {
        $token = $this->stream->user->settings()->where('name', Setting::TWITCH_TOKEN)->first();

        if (!$token) {
            $token = $this->getAccessToken();

            \App\Models\Setting::query()->updateOrInsert(
                [
                    'name' => Setting::TWITCH_TOKEN,
                    'user_id' => $this->stream->user->id,
                ],
                [
                    'value' => $token
                ]
            );
        }
        else
        {
            $token =  $token->value;
        }

        return $token;
    }
}
