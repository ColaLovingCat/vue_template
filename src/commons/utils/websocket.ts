// src/services/websocketService.ts
export class WebSocketService {
    private ws: WebSocket | null = null;
    private url: string;
    private onMessageCallback: (data: any) => void;
  
    constructor(host: string, onMessage: (data: any) => void) {
      this.url = host;
      this.onMessageCallback = onMessage;
    }
  
    connect() {
      this.ws = new WebSocket(this.url);
  
      this.ws.onopen = () => {
        console.log('[WebSocket] 连接成功:', this.url);
      };
  
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.onMessageCallback(data);
      };
  
      this.ws.onclose = () => {
        console.log('[WebSocket] 连接关闭');
      };
  
      this.ws.onerror = (error) => {
        console.error('[WebSocket] 发生错误:', error);
      };
    }
  
    sendMessage(message: any) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      } else {
        console.warn('[WebSocket] 连接未建立，消息发送失败');
      }
    }
  
    close() {
      if (this.ws) {
        this.ws.close();
      }
    }
  }
  