<?php

namespace App\Events;

use App\Models\MotoristaPerfil;
use App\Models\Viaje; // Import the Viaje model
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MotoristaLocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public MotoristaPerfil $motoristaPerfil;
    public ?Viaje $viaje; // The active trip can be null

    /**
     * Create a new event instance.
     */
    public function __construct(MotoristaPerfil $motoristaPerfil)
    {
        $this->motoristaPerfil = $motoristaPerfil;
        // Find the active trip for this motorista
        $this->viaje = Viaje::where('motorista_id', $this->motoristaPerfil->usuario_id)
                            ->whereIn('estado', ['aceptado', 'en_curso'])
                            ->first();
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Only broadcast if there is an active trip
        if ($this->viaje) {
            return [
                new PrivateChannel('viaje.' . $this->viaje->id),
            ];
        }

        return []; // Return an empty array if no active trip is found
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
            'lat' => $this->motoristaPerfil->current_lat,
            'lng' => $this->motoristaPerfil->current_lng,
        ];
    }
}
