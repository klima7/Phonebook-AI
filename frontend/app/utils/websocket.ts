import { useAuth } from '../contexts/AuthContext';

export class WebSocketManager {
  private socket: WebSocket | null = null;
  private callback: ((data: any) => void) | null = null;
  private isConnecting: boolean = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private url: string;
  private token: string | null;

  constructor(url: string, token: string | null) {
    this.url = url;
    this.token = token;
  }

  connect(): Promise<void> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    if (this.isConnecting) {
      return new Promise((resolve) => {
        const checkConnection = () => {
          if (this.socket?.readyState === WebSocket.OPEN) {
            resolve();
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        // Include token as a subprotocol for authentication
        const protocols = this.token ? [`token.${this.token}`] : undefined;
        this.socket = new WebSocket(this.url, protocols);

        this.socket.onopen = () => {
          this.isConnecting = false;
          console.log('WebSocket connection established');
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            // Call the callback with the entire message data
            if (this.callback) {
              this.callback(data);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
          this.socket = null;
          this.attemptReconnect();
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      this.connect().catch(error => {
        console.error('WebSocket reconnection failed:', error);
        this.attemptReconnect();
      });
    }, 3000);
  }

  setMessageHandler(callback: (data: any) => void): () => void {
    this.callback = callback;
    
    // Return unsubscribe function
    return () => {
      this.callback = null;
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.callback = null;
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// Hook for components to use WebSocket
export const useWebSocket = () => {
  const { token } = useAuth();
  
  const getWebSocketManager = (path: string) => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}${path}`;
    return new WebSocketManager(wsUrl, token);
  };

  return getWebSocketManager;
}; 