<?php

declare(strict_types=1);

namespace App\Services\EventHandler\Interfaces;

interface Event
{
    public function __invoke(array $data): void;
}
