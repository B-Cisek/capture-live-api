<?php

declare(strict_types=1);

namespace App\Services\EventHandler\Interfaces;

interface EventHandler
{
    public function handle(string $event): void;
}
