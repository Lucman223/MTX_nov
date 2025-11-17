<?php

namespace App\Events;

use App\Models\MotoristaPerfil;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MotoristaLocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $motoristaPerfil;

    /**
     * Create a new event instance.
     */
    public function __construct(MotoristaPerfil $motoristaPerfil)
    {
        $this->motoristaPerfil = $motoristaPerfil;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('motorista.' . $this->motoristaPerfil->usuario_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'location-updated';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'latitude' => $this->motoristaPerfil->current_lat,
            'longitude' => $this->motoristaPerfil->current_lng,
            'motorista_id' => $this->motoristaPerfil->usuario_id,
        ];
    }
}
