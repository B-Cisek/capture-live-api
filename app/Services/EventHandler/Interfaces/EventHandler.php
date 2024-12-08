<?php

namespace App\Services\EventHandler\Interfaces;

interface EventHandler
{
    public function handle(string $event): void;
}
