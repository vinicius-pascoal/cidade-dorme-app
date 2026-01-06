import Ably from 'ably';

export class AblyService {
  private client: Ably.Realtime;

  constructor() {
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      throw new Error('ABLY_API_KEY não configurada');
    }

    this.client = new Ably.Realtime({ key: apiKey });
  }

  async publishGameEvent(gameId: string, eventType: string, data: any): Promise<void> {
    const channel = this.client.channels.get(`game:${gameId}`);
    await channel.publish(eventType, data);
  }

  async publishPlayerEvent(gameId: string, playerId: string, eventType: string, data: any): Promise<void> {
    const channel = this.client.channels.get(`game:${gameId}:player:${playerId}`);
    await channel.publish(eventType, data);
  }

  getChannel(channelName: string) {
    return this.client.channels.get(channelName);
  }
}
