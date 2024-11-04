import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Scores } from './scores/scores';
import { About } from './about/about';
import { AuthState } from './login/authState';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);

  return (
    <BrowserRouter>
      <div className='body bg-dark text-light'>
        <header class="text-bg-dark">
          <nav class="navbar navbar-expand-sm navbar-dark bg-dark" aria-label="Navbar">
            <div class="container-fluid">
              <a class="navbar-brand" href="/index.html">Tetris Dual</a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-sm-0">
                  <li className='nav-item'>
                    <NavLink className='nav-link' to=''>
                      Login
                    </NavLink>
                  </li>
                  {authState === AuthState.Authenticated && (
                    <li className='nav-item'>
                      <NavLink className='nav-link' to='play'>
                        Play
                      </NavLink>
                    </li>
                  )}
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='leaderboard'>
                      Leaderboard
                    </NavLink>
                  </li>
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='about'>
                      About
                    </NavLink>
                  </li>
                </ul>
                <form role="button">
                  <a href="https://github.com/tychart/startup" class="btn btn-secondary">GitHub</a>
                </form>
              </div>
            </div>
          </nav>
        </header>

        <Routes>
          <Route
            path='/'
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
              />
            }
            exact
          />
          <Route path='/play' element={<Play userName={userName} />} />
          <Route path='/scores' element={<Scores />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;
