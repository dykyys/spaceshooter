import { useEffect, useRef, useState } from 'react';
import { Application, Graphics, Sprite } from 'pixi.js';

import {
  createBullet,
  backGround,
  createRocket,
  createAsteroid,
  createText,
} from './elements';

import {
  StartGame,
  ShowCountBullets,
  ShowGameTime,
  ShowCountdown,
} from './components';
import { updateGameTime } from './helpers';

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const asteriodIntervalId = useRef<number>(0);
  const gameTimeIntervalId = useRef<number>(0);
  const [play, setPlay] = useState(false);
  const [showCountBullets, setShowCountBullets] = useState(0);
  const [gameTime, setGameTime] = useState('00');

  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!play) return;

    gameTimeIntervalId.current = setInterval(() => {
      setGameTime(updateGameTime);
    }, 1000);

    setTimeout(() => {
      clearInterval(gameTimeIntervalId.current);
    }, 60000);

    const app = new Application();
    const rocket = createRocket();

    const bullets: Graphics[] = [];
    const asteroids: Sprite[] = [];
    const keys: Record<string, boolean> = {};

    const bulletSpeed = -10;
    const rocketSpeed = 10;

    let bulletsFired: number = 0;
    let destroyedAsteroids: number = 0;
    let asteroidsCreated: number = 0;

    (async () => {
      await app.init({
        width: 1280,
        height: 720,
        backgroundColor: 0x000000,
      });

      const sprite = await backGround(app);

      app.stage.addChild(sprite, rocket);

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }

      rocket.x = app.screen.width / 2;
      rocket.y = app.screen.height - 90;

      const displayGameOverText = (message: string) => {
        const text = createText(app, message);
        app.stage.addChild(text);

        if (text.scale.x > 1) {
          text.scale.x -= 0.02;
          text.scale.y -= 0.02;
        } else {
          text.scale.set(1);
          app.stop();
        }
      };

      asteriodIntervalId.current = setInterval(async () => {
        if (asteroids.length >= 10) {
          clearInterval(asteriodIntervalId.current);
          return;
        }

        const asteroid = await createAsteroid();
        app.stage.addChild(asteroid);
        asteroids.push(asteroid);
      }, 1000);

      app.ticker.add((time) => {
        console.log('tick');

        bullets.forEach((bullet, index) => {
          bullet.y -= 10;

          if (bullet.y < 0) {
            app.stage.removeChild(bullet);
            bullets.splice(index, 1);
          }

          asteroids.forEach((asteroid, asteroidIndex) => {
            const boundsA = bullet.getBounds();
            const boundsB = asteroid.getBounds();

            if (
              boundsA.x + boundsA.width > boundsB.x &&
              boundsA.x < boundsB.x + boundsB.width &&
              boundsA.y + boundsA.height > boundsB.y &&
              boundsA.y < boundsB.y + boundsB.height
            ) {
              app.stage.removeChild(bullet);
              bullets.splice(index, 1);
              destroyedAsteroids += 1;

              app.stage.removeChild(asteroid);
              asteroids.splice(asteroidIndex, 1);

              // if (destroyedAsteroids === 10) {
              console.log(destroyedAsteroids);
              displayGameOverText('YOU WIN');
              // app.stop();
              // }
            }
          });
        });

        asteroids.forEach((asteroid, index) => {
          if (asteroid.y > app.screen.height) {
            app.stage.removeChild(asteroid);
            asteroid.destroy();
            asteroids.splice(index, 1);
            return;
          }
          asteroid.y += 0.3;
          asteroid.rotation += 0.01 * time.deltaTime;
        });

        if (keys['ArrowLeft'] && rocket.x > rocket.width / 2) {
          rocket.x -= rocketSpeed;
        }

        if (
          keys['ArrowRight'] &&
          rocket.x < app.screen.width - rocket.width / 2
        ) {
          rocket.x += rocketSpeed;
        }

        bullets.forEach((bullet, index) => {
          bullet.y += bulletSpeed;
          if (bullet.y < 0) {
            app.stage.removeChild(bullet);
            bullets.splice(index, 1);
          }
        });
      });
    })();

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;

      if (e.code === 'Space') {
        if (bulletsFired === 10) {
          return;
        }

        const bullet = createBullet();

        bullet.x = rocket.x - 2.5;
        bullet.y = rocket.y - 115;

        bullets.push(bullet);
        app.stage.addChild(bullet);
        setShowCountBullets((prev) => prev + 1);
        bulletsFired += 1;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);

      app.destroy(true, { children: true });
    };
  }, [play]);

  const onStartGame = () => {
    setGameStarted(true);
    setTimeout(() => {
      setPlay(true);
    }, 4000);
  };

  return (
    <div style={{ position: 'relative', width: '1280px', height: '720px' }}>
      {gameStarted && (
        <ShowCountdown onComplete={() => setGameStarted(false)} />
      )}
      {play ? (
        <>
          <ShowCountBullets bullets={showCountBullets} />
          <ShowGameTime time={gameTime} />
          <div ref={canvasRef} />
        </>
      ) : (
        <StartGame onClick={onStartGame} />
      )}
    </div>
  );
}

export default App;
