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