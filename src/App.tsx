import { useEffect, useRef } from 'react';
import { Application, Graphics, Sprite } from 'pixi.js';
import { createRocket } from './elements/rocket';
import { createBullet } from './elements/bullet';

import { backGround } from './elements/backGround';
import { createAsteroid } from './elements/asteroid';

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const asteriodIntervalId = useRef<number>(0);

  useEffect(() => {
    const app = new Application();
    const rocket = createRocket();

    const bullets: Graphics[] = [];
    const asteroids: Sprite[] = [];

    const bulletSpeed = -10;
    const rocketSpeed = 10;

    const keys: Record<string, boolean> = {};

    (async () => {
      await app.init({
        width: 1280,
        height: 720,
        backgroundColor: 0x000000,
      });

      const sprite = await backGround();

      sprite.width = app.screen.width;
      sprite.height = app.screen.height;

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }

      rocket.x = app.screen.width / 2;
      rocket.y = app.screen.height - 90;

      app.stage.addChild(sprite, rocket);

      asteriodIntervalId.current = setInterval(async () => {
        if (asteroids.length === 10) {
          clearInterval(asteriodIntervalId.current);
          return;
        }
        const asteroid = await createAsteroid();
        app.stage.addChild(asteroid);
        asteroids.push(asteroid);
      }, 2000);

      app.ticker.add((time) => {
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

              app.stage.removeChild(asteroid);
              asteroids.splice(asteroidIndex, 1);

              console.log('yes');
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
          asteroid.y += 0.6;
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
        const bullet = createBullet();

        bullet.x = rocket.x - 2.5;
        bullet.y = rocket.y - 115;

        bullets.push(bullet);
        app.stage.addChild(bullet);
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
    };
  }, []);

  return (
    <>
      <p>10/10</p>
      <div ref={canvasRef} />
    </>
  );
}

export default App;
