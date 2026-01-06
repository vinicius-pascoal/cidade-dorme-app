import Ably from 'ably';

export class AblyService {
  private client: Ably.Realtime | null;
  private isEnabled: boolean;

  constructor() {
    const apiKey = process.env.ABLY_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️  ABLY_API_KEY não configurada - Serviço de realtime desabilitado');
      this.client = null;
      this.isEnabled = false;
    } else {
      this.client = new Ably.Realtime({ key: apiKey });
      this.isEnabled = true;
      console.log('✅ Ably conectado - Realtime habilitado');
    }
  }

  async publishGameEvent(gameId: string, eventType: string, data: any): Promise<void> {
    if (!this.isEnabled || !this.client) {
      console.log(`[Ably Desabilitado] ${eventType} no jogo ${gameId}`);
      return;
    }
    
    const channel = this.client.channels.get(`game:${gameId}`);
    await channel.publish(eventType, data);
  }

  async publishPlayerEvent(gameId: string, playerId: string, eventType: string, data: any): Promise<void> {
    if (!this.isEnabled || !this.client) {
      console.log(`[Ably Desabilitado] ${eventType} para jogador ${playerId}`);
      return;
    }
    
    const channel = this.client.channels.get(`game:${gameId}:player:${playerId}`);
    await channel.publish(eventType, data);
  }

  getChannel(channelName: string) {
    if (!this.isEnabled || !this.client) {
      throw new Error('Ably não está habilitado. Configure ABLY_API_KEY no .env');
    }
    return this.client.channels.get(channelName);
  }
}
