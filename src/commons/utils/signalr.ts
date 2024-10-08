// src/services/signalrService.ts

import * as signalR from '@microsoft/signalr';

class SignalRService {
  public isActive = false;
  private connection: signalR.HubConnection | null = null;

  private listener: ((msg: string) => void) | null = null;
  private afterStart: (() => void) | null = null;

  async startConnection(host: string): Promise<void> {
    if (!this.connection) {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(host + '/chatHub', {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.connection.on('ReceiveMessage', (msg: any) => {
        console.log('[SignalR]: ', 'ReceiveMessage');
        if (this.listener) {
          this.listener(msg);
        }
      });

      this.connection.onclose(() => {
        console.log('[SignalR]: ', 'Closed');
        this.isActive = false;
      });

      try {
        await this.connection.start();
        console.log('[SignalR]: ', 'Connected');
        this.isActive = true;
        if (this.afterStart) {
          this.afterStart();
        }
      } catch (err) {
        console.error('[SignalR]: ', 'Error while starting connection: ' + err);
        this.connection = null;
      }
    }
  }

  async restartCon() {
    if (this.connection) {
      try {
        await this.connection.start();
        console.log('[SignalR]: ', 'Connected');
        this.isActive = true;
      } catch (err) {
        console.error('[SignalR]: ', 'Error while starting connection: ' + err);
        this.connection = null;
      }
    }
  }

  async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('[SignalR]: ', 'Disconnected');
        this.isActive = false;
      } catch (err) {
        console.error('[SignalR]: ', 'Error while stopping connection: ' + err);
      } finally {
        this.connection = null;
      }
    }
  }

  async sendMessage(message: any): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.invoke('SendMessage', message);
        console.log('[SignalR]: ', 'SendMessage');
      } catch (err) {
        console.error('[SignalR]: ', 'Error while sending message: ' + err);
      }
    } else {
      console.error('[SignalR]: ', 'No active connection to send message');
    }
  }

  setListener(callback: (msg: string) => void): void {
    this.removeListener();
    this.listener = callback;
  }

  removeListener(): void {
    this.listener = null;
  }

  setAfterStart(callback: () => void): void {
    this.removeAfterStart();
    this.afterStart = callback;
  }

  removeAfterStart(): void {
    this.afterStart = null;
  }
}

const signalRServiceInstance = new SignalRService();

export default signalRServiceInstance;
