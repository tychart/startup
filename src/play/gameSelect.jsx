import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverFacade } from './serverFacade.js';
import './gameSelect.css'; // Import the custom CSS file

export function GameSelect(props) {
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [currUser, setCurrUser] = useState(props.userName);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // console.log(currUser)
        const games = await serverFacade.getGames();
        setGames(games);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const createGame = async () => {
    try {
      const gameName = prompt('Enter game name:');
      if (gameName) {
        const newGame = await serverFacade.createGame(gameName);
        setGames([...games, newGame]);
      }
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const joinGame = async () => {
    if (selectedGameId) {
      try {
        await serverFacade.joinGame(selectedGameId, currUser);
        navigate(`/play/${selectedGameId}`);
      } catch (error) {
        console.error('Error joining game:', error);
      }
    }
  };

  return (
    <main className="game-select">
      <h1>Select or Create a Game</h1>
      <button onClick={createGame} className="btn btn-primary">
        Create New Game
      </button>
      <h2>Available Games</h2>
      <ul className="game-list">
        {games.map((game) => (
          <li key={game.id} className="list-group-item game-item">
            <button
              onClick={() => setSelectedGameId(game.id)}
              className={`${selectedGameId === game.id ? 'btn-selected' : 'btn-outline-light'}`}
            >
              Join Game {game.id}: {game.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedGameId && (
        <button onClick={joinGame} className="btn btn-success">
          Join Selected Game
        </button>
      )}
    </main>
  );
}
