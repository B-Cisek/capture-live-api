<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\AuthService\Concrete\AuthService;
use App\Services\AuthService\Interfaces\AuthService as AuthServiceContract;
use App\Services\Cache\Adapter\RedisCache;
use App\Services\Cache\Interfaces\Cache;
use App\Services\Jwt\Concrete\JwtBlacklistService;
use App\Services\Jwt\Concrete\JwtProvider;
use App\Services\Jwt\Interfaces\JwtBlacklist;
use App\Services\Jwt\Interfaces\JwtProvider as JwtProviderContract;
use App\Services\PubSub\Adapter\RedisPubSubService;
use App\Services\PubSub\Interfaces\PubSubInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;
use Redis;

final class AppServiceProvider extends ServiceProvider
{
    public $bindings = [
        AuthServiceContract::class => AuthService::class,
        Cache::class => RedisCache::class,
        JwtBlacklist::class => JwtBlacklistService::class,
    ];

    public function register(): void
    {
        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }

        $this->app->bind(JwtProviderContract::class, function () {
            $configuration = Configuration::forSymmetricSigner(
                new Signer\Hmac\Sha512(),
                InMemory::base64Encoded(Config::get('jwt.secret')),
            );

            $configuration->setValidationConstraints();

            return new JwtProvider($configuration);
        });

        $this->app->bind(PubSubInterface::class, function () {
            $redis = new Redis();
            $config = Config::get('database.redis.default');
            $redis->connect($config['host'], (int) $config['port']);

            return new RedisPubSubService($redis);
        });
    }

    public function boot(): void
    {
        Model::shouldBeStrict(app()->isLocal());
    }
}
