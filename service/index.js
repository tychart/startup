const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
const { peerProxy } = require('./websocketHandler.js'); // Import the peerProxy function
const GameManager = require('./games.js'); // Import the GameManager



const authCookieName = 'token';


// Middleware to log every request
app.use((req, res, next) => {
  console.log("my middleware");
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// The service port may be set on the command line
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the applications static content
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

console.log("Test");

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// // Middleware to log every request
// apiRouter.use((req, res, next) => {
//   console.log("my middleware");
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.ip}`);
//   next();
// });

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.userName)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.userName, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  console.log("Got in here!!!!!!!!")
  // console.log("With these creds: ", req);
  const user = await DB.getUser(req.body.userName);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      console.log("allowed");
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});


// Pass through background to avoid cors
apiRouter.get('/background', async (req, res) => {

  console.log('Backend route /background called'); // Confirm route is hit

  try {
    const response = await fetch(
      'https://wallhaven.cc/api/v1/search?&sorting=random&purity=100&categories=111&colors=000000'
    );
    const text = await response.text(); // Fetch as plain text first
    console.log('Raw response from Wallhaven:', text); // Log response to debug
    const data = JSON.parse(text); // Try parsing it
    res.json(data); // Send parsed JSON to the frontend
  } catch (error) {
    console.error('Error in backend:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Wallhaven' });
  }
});

// secureApiRouter verifies credentials for endpoints
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// GetScores
secureApiRouter.get('/scores', async (req, res) => {
  const scores = await DB.getHighScores();
  res.send(scores);
});

// SubmitScore
secureApiRouter.post('/score', async (req, res) => {
  const score = { ...req.body, ip: req.ip };
  await DB.addScore(score);
  const scores = await DB.getHighScores();
  res.send(scores);
});

// // CreateGame
// secureApiRouter.post('/games', async (req, res) => {
//   const score = { ...req.body, ip: req.ip };

//   console.log("Got here!!!!!!!!!!!!!!!!!!")



//   await DB.addScore(score);
//   const scores = await DB.getHighScores();
//   res.send(scores);
// });

// Create a new game
secureApiRouter.post('/games', async (req, res) => {
  const { name } = req.body;
  console.log("Got here!!!!!!!!!!!!!!!!!!")
  console.log("Have this name: ", name)
  const game = GameManager.createGame(name);
  console.log(GameManager.getAllGames())
  res.status(201).json(game);
});

// Get all games
secureApiRouter.get('/games', async (req, res) => {
  const games = GameManager.getAllGames();
  res.json(games);
});

// Add a player to a game
secureApiRouter.post('/games/:id/join', async (req, res) => {
  const { id } = req.params;
  const { userName } = req.body;
  console.log(id, req.body, userName);
  const success = GameManager.addPlayerToGame(parseInt(id, 10), userName);
  console.log(GameManager.getAllGames());
  if (success) {
    res.status(200).send({ msg: 'Player added' });
  } else {
    res.status(400).send({ msg: 'Game is full or does not exist' });
  }
});

// Remove a player from a game
secureApiRouter.post('/games/:id/leave', async (req, res) => {
  const { id } = req.params;
  const { player } = req.body;
  GameManager.removePlayerFromGame(parseInt(id, 10), player);
  res.status(200).send({ msg: 'Player removed' });
});

// Delete a game
secureApiRouter.delete('/games/:id', async (req, res) => {
  const { id } = req.params;
  GameManager.deleteGame(parseInt(id, 10));
  res.status(204).end();
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  console.log("HIT HERE FOR SOME REASON!")
  res.sendFile('index.html', { root: 'public' });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Initialize the WebSocket server
peerProxy(httpService);