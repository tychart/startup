export class WebSocketManager {
    constructor() {
      this.events = [];
      this.handlers = [];
      this.socket = null;
    }
  
    // Initialize WebSocket connection
    connect() {
      const port = window.location.port;
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
  
      this.socket.onopen = () => {
        this.receiveEvent({ type: 'system', value: { msg: 'connected' } });
      };
  
      this.socket.onclose = () => {
        this.receiveEvent({ type: 'system', value: { msg: 'disconnected' } });
      };
  
      this.socket.onmessage = async (msg) => {
        try {
          const event = JSON.parse(msg.data);
          this.receiveEvent(event);
        } catch (e) {
          console.error('Failed to parse incoming message:', e);
        }
      };
    }
  
    // Send a message via WebSocket
    sendMessage(type, value) {
      const event = { type, value };
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(event));
        console.log("Sent message: ", event);
      } else {
        console.error('WebSocket is not open. Cannot send message:', event);
      }
    }
  
    // Add an event handler
    addHandler(handler) {
      this.handlers.push(handler);
    }
  
    // Remove an event handler
    removeHandler(handler) {
      this.handlers = this.handlers.filter((h) => h !== handler);
    }
  
    // Process received events
    receiveEvent(event) {
      this.events.push(event);
      this.handlers.forEach((handler) => handler(event));
    }
  
    // Create a new game
    createGame() {
      this.sendMessage('create', {});
    }
  
    // Join an existing game
    joinGame(gameId) {
      this.sendMessage('join', { gameId });
    }
  
    // Send game updates (e.g., board state)
    sendGameUpdate(boardState) {
      this.sendMessage('gameUpdate', { state: boardState });
    }
  }

// export { WebSocketManager };