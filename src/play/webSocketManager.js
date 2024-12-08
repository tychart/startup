export class WebSocketManager {
  constructor(gameId, userName) {
    this.events = [];
    this.handlers = [];
    this.socket = null;
    this.currentGameId = gameId; // Track the current game ID
    this.currentUserName = userName; // Track the current user name
    this.messageQueue = []; // Queue for messages to be sent when the connection is open
  }

  // Initialize WebSocket connection
  connect() {
    const port = window.location.port;
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);

    this.socket.onopen = () => {
      this.receiveEvent({ type: 'system', value: { msg: 'connected' } });
      // Send any queued messages
      while (this.messageQueue.length > 0) {
        const event = this.messageQueue.shift();
        this.sendMessage(event.type, event.value);
      }
    };

    this.socket.onclose = () => {
      this.receiveEvent({ type: 'system', value: { msg: 'disconnected' } });
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
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
      // Queue the message to be sent once the connection is open
      this.messageQueue.push(event);
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

  // Join an existing game
  joinGame(gameId, userName) {
    this.currentGameId = gameId;
    this.currentUserName = userName;
    this.sendMessage('join', { gameId });
  }

  // Send game updates (e.g., board state)
  sendGameUpdate(boardState) {
    this.sendMessage('gameUpdate', { state: boardState });
  }

  // Disconnect the WebSocket connection
  disconnectWebSocket() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      // Inform the server about the disconnect
      this.sendMessage('disconnect', {
        gameId: this.currentGameId,
        userName: this.currentUserName,
      });

      // Wait briefly to ensure the message is sent
      setTimeout(() => {
        this.socket.close();
        console.log('WebSocket connection closed.');
      }, 100); // Adjust delay if necessary
    }
  }
}
