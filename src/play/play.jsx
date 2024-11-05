import React from 'react';

// import { Players } from './players';
import { TetrisGame } from './tetris-game';

export function Play(props) {
  return (
    <main className='bg-secondary'>
      {/* <Players userName={props.userName} /> */}
      <TetrisGame userName={props.userName} />
    </main>
  );
}
