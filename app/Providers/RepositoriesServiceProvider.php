<?php

namespace App\Providers;

use App\Repositories\BlackListedToken\BlackListedTokenRepository;
use App\Repositories\BlackListedToken\BlackListedTokenRepositoryInterface;
use App\Repositories\Stream\StreamRepository;
use App\Repositories\Stream\StreamRepositoryInterface;
use App\Repositories\User\UserRepository;
use App\Repositories\User\UserRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class RepositoriesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(BlackListedTokenRepositoryInterface::class, BlackListedTokenRepository::class);
        $this->app->bind(StreamRepositoryInterface::class, StreamRepository::class);
    }

    public function boot(): void
    {
    }
}
