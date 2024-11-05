import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './authenticated.css';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('userName');
    props.onLogout();
  }

  return (
    <div>
      <div className='playerName'>{props.userName}</div>
      <Button variant='primary' className='mx-1' onClick={() => navigate('/play')}>
        Play
      </Button>
      <Button variant='secondary' className='mx-1' onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
}
