# Tetris Dual

## Elevator Pitch

My app will let 2 people play the classic game of Tetris but this version you get to play aginst each other in real time. When one player completes a row by filling it all the way up horizontaly, then that row is sent to the player, leading them to run out of space faster. High scores will be kept by the central server, allowing everyone to compete for the top place.

## Sketches

!["this is my svg sketch"](assets/TetrisDualSketch.svg)
!["this is my png sketch"](assets/TetrisDualSketch.png)

## How I will use technologies

* HTML: Basic web interface layout
* CSS: Styling the blocks and anamating the movements and the background
* JavaScript: The timing, and the logic for the falling blocks
* React: Orginizing all the diffrent front end components to all work together
* Web Service: I will have a background behind the game that will be pulled using an api library of images to encourage competition
* Authentication: Have a login and a set of user accounts to keep track of high scores
* Database: A storage of logins and user info, also high scores
* WebSocket: The row that the opponent just completed will be pushed to the client by use of websockets

