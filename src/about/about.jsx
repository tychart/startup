import React from 'react';
import './about.css';

export function About(props) {
  const [imageUrl, setImageUrl] = React.useState('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=');
  const [quote, setQuote] = React.useState('Loading...');
  const [quoteAuthor, setQuoteAuthor] = React.useState('unknown');

  return (
    <main className='container-fluid bg-secondary text-center'>
      <div id="container-box">
        <div id='picture' className='picture-box'>
          <img src="/assets/favicon.png" alt='Tetris Dual Logo' />
        </div>

        <p>Tetris Dual is a spin on the classic game of Tetris in which you face off head to head on who can last the longest. </p>

        <div className='quote-box bg-light text-dark'>
          <p className='quote'>This game was created by Tyler Chartrand. Any questions can be forwarded to him at tychart@byu.edu</p>
        </div>
      </div>
    </main>
  );
}
