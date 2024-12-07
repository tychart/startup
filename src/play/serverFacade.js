import axios from 'axios';

class ServerFacade {
  async getGames() {
    try {
      const response = await axios.get('/api/games');
      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }

  async createGame(gameName) {
    try {
      const response = await axios.post('/api/games', { name: gameName });
      return response.data;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  async joinGame(gameId, userName) {
    try {
      const response = await axios.post(`/api/games/${gameId}/join`, { userName });
      return response.data;
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
  }
}

export const serverFacade = new ServerFacade();