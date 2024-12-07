class Game {
    constructor(id, name) {
      this.id = id;
      this.name = name;
      this.players = [];
    }
  
    addPlayer(player) {
      if (this.players.length < 2) {
        this.players.push(player);
        return true;
      }
      return false;
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
  
    createGame(name) {
      const game = new Game(this.nextId++, name);
      this.games.push(game);
      return game;
    }
  
    getGame(id) {
      return this.games.find(game => game.id === id);
    }
  
    getAllGames() {
      return this.games;
    }
  
    addPlayerToGame(gameId, player) {
      const game = this.getGame(gameId);
      if (game && !game.isFull()) {
        return game.addPlayer(player);
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