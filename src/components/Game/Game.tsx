import { useEffect, useRef, useState } from 'react';
import { Application, Graphics, Sprite, Text } from 'pixi.js';

import {
  createBullet,
  backGround,
  createRocket,
  createAsteroid,
  createText,
} from '../../elements';

import { ShowCountBullets, ShowGameTime } from '../../components';

import { updateGameTime } from '../../helpers';

export const Game = ({ setPlay }: { setPlay: () => void }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const asteriodIntervalId = useRef<number>(0);
  const gameTimeIntervalId = useRef<number>(0);
  const clearGameTimeTimeoutId = useRef<number>(0);
  const [start, setStart] = useState(false);
  const [showCountBullets, setShowCountBullets] = useState(0);
  const [gameTime, setGameTime] = useState('00');

  const LIMIT_ASTEROIDS: number = 10;

  setTimeout(() => setStart(true), 0);

  useEffect(() => {
    if (!start) return;
    gameTimeIntervalId.current = setInterval(() => {
      setGameTime(updateGameTime);
    }, 1000);

    clearGameTimeTimeoutId.current = setTimeout(() => {
      clearInterval(gameTimeIntervalId.current);
    }, 60000);

    const app = new Application();
    const rocket = createRocket();

    const bullets: Graphics[] = [];
    const asteroids: Sprite[] = [];
    const keys: Record<string, boolean> = {};

    const bulletSpeed = -10;
    const rocketSpeed = 10;

    let asteroidImpacts: number = 0.4;
    let bulletsFired: number = 0;
    let destroyedAsteroids: number = 0;
    let asteroidsCreated: number = 0;

    const displayGameOverText = (text: Text) => {
      clearInterval(asteriodIntervalId.current);
      clearInterval(gameTimeIntervalId.current);
      clearTimeout(clearGameTimeTimeoutId.current);

      asteroidImpacts = 0;
      if (text.scale.x > 1) {
        text.scale.x -= 0.015;
        text.scale.y -= 0.015;
      } else {
        text.scale.set(1);
        app.stop();
        setTimeout(() => {
          setPlay();
        }, 2000);
      }
    };

    (async () => {
      await app.init({
        width: 1280,
        height: 720,
        backgroundColor: 0x000000,
      });

      const sprite = await backGround(app);

      app.stage.addChild(sprite, rocket);

      const textWin = createText(app, true);
      const textLoss = createText(app, false);

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }

      rocket.x = app.screen.width / 2;
      rocket.y = app.screen.height - 90;

      asteriodIntervalId.current = setInterval(async () => {
        if (asteroidsCreated >= LIMIT_ASTEROIDS) {
          clearInterval(asteriodIntervalId.current);
          return;
        }

        const asteroid = await createAsteroid();
        app.stage.addChild(asteroid);
        asteroids.push(asteroid);
        asteroidsCreated += 1;
      }, 2500);

      app.ticker.add((time) => {
        if (destroyedAsteroids === LIMIT_ASTEROIDS) {
          if (
            !app.stage.children.find((item) => item?.renderPipeId === 'text')
          ) {
            app.stage.addChild(textWin);
          }
          displayGameOverText(textWin);
        }

        if (
          (destroyedAsteroids !== LIMIT_ASTEROIDS &&
            bulletsFired === LIMIT_ASTEROIDS &&
            bullets.length === 0) ||
          (asteroidsCreated === LIMIT_ASTEROIDS &&
            asteroids.length === 0 &&
            bulletsFired < LIMIT_ASTEROIDS)
        ) {
          if (
            !app.stage.children.find((item) => item?.renderPipeId === 'text')
          ) {
            app.stage.addChild(textLoss);
          }
          displayGameOverText(textLoss);
        }
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
          asteroid.y += asteroidImpacts;
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
        bulletsFired += 1;

        const bullet = createBullet(rocket);
        bullets.push(bullet);
        app.stage.addChild(bullet);

        setShowCountBullets((prev) => prev + 1);
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
  }, [setPlay, start]);

  return (
    <>
      <ShowCountBullets bullets={showCountBullets} limit={LIMIT_ASTEROIDS} />
      <ShowGameTime time={gameTime} />
      <div ref={canvasRef} />
    </>
  );
};
