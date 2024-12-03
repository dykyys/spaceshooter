import { useState } from 'react';

import { StartGame, ShowCountdown, Game } from './components';

function App() {
  const [play, setPlay] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const onStartGame = () => {
    setGameStarted(true);

    setTimeout(() => {
      setPlay(true);
    }, 4000);
  };

  return (
    <div style={{ position: 'relative', width: '1280px', height: '720px' }}>
      {gameStarted && (
        <ShowCountdown
          onComplete={() => setGameStarted(false)}
          message="Go!!!"
        />
      )}
      {play ? (
        <Game setPlay={() => setPlay(false)} />
      ) : (
        <StartGame onClick={onStartGame} />
      )}
    </div>
  );
}

export default App;
