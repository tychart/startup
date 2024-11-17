import React, { useState, useEffect } from 'react';
import { TetrisGame } from './tetris-game';

export function Play(props) {
  const [backgroundUrl, setBackgroundUrl] = useState('');
  console.log('Component is rendering');

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        console.log('Making fetch request to /background');
        const response = await fetch('https://picsum.photos/300/?blur');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setBackgroundUrl(data.data[0].path);
        } else {
          console.error('No wallpapers found!');
          setBackgroundUrl('/TetrisBackgroud1.svg');
          setBackgroundUrl('https://picsum.photos/300/?blur');
        }
      } catch (error) {
        console.error('Error fetching background image:', error);
        setBackgroundUrl('/TetrisBackgroud1.svg');
        setBackgroundUrl('https://picsum.photos/300/?blur');
      }
    };
  
    fetchBackground();
  }, []); // Runs once when the component mounts

  return (
    <main
      className="bg-secondary"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh', // Ensure it covers the full viewport height
      }}
    >
      <TetrisGame userName={props.userName} />
    </main>
  );
}