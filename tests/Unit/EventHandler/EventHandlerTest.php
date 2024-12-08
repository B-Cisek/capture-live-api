<?php

namespace Tests\Unit\EventHandler;

use App\Services\EventHandler\Concrete\EventHandler;
use App\Services\EventHandler\Concrete\EventHandlerResolver;
use Exception;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class EventHandlerTest extends TestCase
{
    private EventHandler $eventHandler;

    protected function setUp(): void
    {
        parent::setUp();
        $this->eventHandler = new EventHandler();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    #[Test]
    public function it_throws_exception_for_invalid_json(): void
    {
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Invalid Event JSON');

        $this->eventHandler->handle('invalid json');
    }

    #[Test]
    public function it_throws_exception_when_handler_not_found(): void
    {
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Handler Not Found');

        $this->mockEventHandlerResolver('non.existent.event', 'NonExistentClass');

        $input = json_encode([
            'event' => 'non.existent.event',
            'data' => []
        ]);

        $this->eventHandler->handle($input);
    }

    #[Test]
    public function it_throws_exception_when_handler_does_not_implement_event_interface(): void
    {
        $this->expectException(Exception::class);
        $this->expectExceptionMessage("Handler Must Implement Event Interface");

        $invalidEventClass = new class() {
            public function __invoke() {}
        };

        $this->mockEventHandlerResolver('recording-started', get_class($invalidEventClass));

        $input = json_encode([
            'event' => 'recording-started',
            'data' => []
        ]);

        $this->eventHandler->handle($input);
    }

    private function mockEventHandlerResolver(string $eventName, string $eventClass): void
    {
        $resolver = Mockery::mock('overload:' . EventHandlerResolver::class);
        $resolver
            ->expects('resolve')
            ->with($eventName)
            ->andReturns($eventClass);
    }
}
