class Player {
  constructor(userName) {
    this.userName = userName;
    this.wsConnection = null;
  }

  setWebSocketConnection(connection) {
    this.wsConnection = connection;
  }
}

class Game {
  constructor(id, gameName) {
    this.id = id;
    this.gameName = gameName;
    this.players = [];
  }

  addPlayer(userName) {
    if (this.players.length < 2) {
      // this.players.push(player);
      
      this.players.push(new Player(userName));

      return true;
    }
    return false;
  }

  getPlayer(index) {
    
  }

  removePlayer(player) {
    this.players = this.players.filter(p => p !== player);
  }

  isFull() {
    return this.players.length === 2;
  }
}

class GameManager {
  constructor() {
    this.games = [];
    this.nextId = 1;
  }

  createGame(gameName) {
    const game = new Game(this.nextId++, gameName);
    this.games.push(game);
    return game;
  }

  getGame(id) {
    return this.games.find(game => game.id === id);
  }

  getAllGames() {
    return this.games;
  }

  addPlayerToGame(gameId, userName) {
    const game = this.getGame(gameId);
    if (game && !game.isFull()) {
      return game.addPlayer(userName);
    }
    return false;
  }

  removePlayerFromGame(gameId, player) {
    const game = this.getGame(gameId);
    if (game) {
      game.removePlayer(player);
    }
  }

  deleteGame(gameId) {
    this.games = this.games.filter(game => game.id !== gameId);
  }
}

module.exports = new GameManager();