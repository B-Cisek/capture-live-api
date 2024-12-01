<?php

declare(strict_types=1);

namespace App\Services\Api\Twitch;

use App\Enums\Setting;
use App\Models\Stream;
use Illuminate\Support\Facades\Http;

final class TwitchApi
{
    use Token;

    private const string AUTH_URL = 'https://id.twitch.tv/oauth2/token';
    private const string API_URL = 'https://api.twitch.tv/helix';
    private ?string $clientId;
    private ?string $clientSecret;
    private string $token;
    private Stream $stream;

    public function __construct(Stream $stream)
    {
        $this->stream = $stream;

        $clientId = $stream->user->settings()->where('name', Setting::TWITCH_CLIENT_ID)?->first()->value;

        if (!$clientId) {
            throw new \Exception('Twitch client id not found');
        }

        $this->clientId = $clientId;

        $clientSecret = $stream->user->settings()->where('name', Setting::TWITCH_SECRET_KEY)?->first()->value;

        if (!$clientSecret) {
            throw new \Exception('Twitch secret key not found');
        }

        $this->clientSecret = $clientSecret;

        $this->token = $this->getToken();
    }

    public function isChannelLive(): bool
    {
        $response = Http::withToken($this->token)
            ->withHeaders([
                'Client-Id' => $this->clientId
            ])
            ->withQueryParameters([
                'user_login' => $this->stream->channel
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
}
