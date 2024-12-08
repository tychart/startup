class Player {
  constructor(userName) {
    this.userName = userName;
    this.wsConnection = null;
  }

  setWebSocketConnection(connection) {
    this.wsConnection = connection;
  }

  getWebSocketConnection() {
    return this.wsConnection;
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
    return this.players[index];
  }

  getPlayerByUsername(userName) {
    const index = this.players.findIndex(player => player.userName === userName);

    if (index >= 0 && index < this.players.length) {
      return this.players[index];
    } else {
      throw new Error(`Player with username '${userName}' not found.`);
    }
  }

  getOpponentByPlayerUsername(userName) {
    const index = this.players.findIndex(player => player.userName === userName);
  
    if (index >= 0 && index < this.players.length) {
      // Since there are exactly 2 players, the opponent is the other player
      const opponentIndex = (index === 0) ? 1 : 0;
      return this.players[opponentIndex];
    } else {
      throw new Error(`Player with username '${userName}' not found.`);
    }
  }

  removePlayer(playerIndex) {
    if (playerIndex >= 0 && playerIndex < this.players.length) {
      
      this.players.splice(playerIndex, 1);
      
    } else {
      throw new Error(`Invalid player index: ${playerIndex}`);
    }
  }

  removePlayerByUsername(userName) {
    const index = this.players.findIndex(player => player.userName === userName);
    if (index >= 0 && index < this.players.length) {
      this.players.splice(index, 1);
    } else {
      console.log(`Player with username '${userName}' not found.`)
      // throw new Error(`Player with username '${userName}' not found.`);
    }
    // console.log("Final: ", this.players)
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
    return this.games.find(game => game.id == id);
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

  removePlayerFromGame(gameId, userName) {
    const game = this.getGame(gameId);
    if (game) {
      game.removePlayerByUsername(userName);
    } else {
      throw new Error(`Game with id '${gameId}' not found.`);
    }
  }

  deleteGame(gameId) {
    this.games = this.games.filter(game => game.id !== gameId);
  }

  toString() {
    return this.games.map(game => {
      const players = game.players.map((player, index) => `${index + 1}: ${player.userName}`);
      return `Game ${game.id} '${game.gameName}' - Players: ${players.join(', ')}`;
    }).join('\n');
  }
}

module.exports = new GameManager();