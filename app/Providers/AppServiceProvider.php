<?php

namespace App\Providers;

use App\Services\AuthService\Concrete\AuthService;
use App\Services\AuthService\Interfaces\AuthService as AuthServiceContract;
use App\Services\Cache\Adapter\RedisCache;
use App\Services\Cache\Interfaces\Cache;
use App\Services\Jwt\Concrete\JwtBlacklistService;
use App\Services\Jwt\Concrete\JwtProvider;
use App\Services\Jwt\Interfaces\JwtBlacklist;
use App\Services\Jwt\Interfaces\JwtProvider as JwtProviderContract;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }

        $this->app->bind(JwtProviderContract::class, function () {
            $configuration = Configuration::forSymmetricSigner(
                new Signer\Hmac\Sha512(),
                InMemory::base64Encoded(Config::get('jwt.secret'))
            );

            $configuration->setValidationConstraints();

            return new JwtProvider($configuration);
        });

        $this->app->bind(AuthServiceContract::class, AuthService::class);
        $this->app->bind(Cache::class, RedisCache::class);
        $this->app->bind(JwtBlacklist::class, JwtBlacklistService::class);
    }

    public function boot(): void
    {
        Model::shouldBeStrict(app()->isLocal());
    }
}
