import { useEffect, useRef, useState } from 'react';
import { Application, Graphics, Sprite, Text } from 'pixi.js';

import {
  createBullet,
  backGround,
  createRocket,
  createAsteroid,
  createBoss,
  createBossHPBar,
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
  const [level, setLevel] = useState(1);

  const LIMIT_ASTEROIDS: number = 10;

  setTimeout(() => setStart(true), 0);

  useEffect(() => {
    if (!start) return;

    const app = new Application();
    const rocket = createRocket();

    const bullets: Graphics[] = [];
    const bossBullets: Graphics[] = [];
    const asteroids: Sprite[] = [];
    const keys: Record<string, boolean> = {};

    const bulletSpeed = -10;
    const rocketSpeed = 10;

    let bulletsFired: number = 0;
    let destroyedAsteroids: number = 0;
    let asteroidsCreated: number = 0;

    const startBossLevel = () => {
      const boss = createBoss(app);
      const bossHPBar = createBossHPBar(app, boss);

      let bossHP = 4;
      let bossDirection = 1;

      app.stage.addChild(boss, bossHPBar);

      const bossShootInterval = setInterval(() => {
        const bossBullet = createBullet(boss, { color: 0xff0000 });
        bossBullets.push(bossBullet);
        app.stage.addChild(bossBullet);
      }, 2000);

      app.ticker.add((time) => {
        boss.x += bossDirection * 2;
        if (boss.x < 50 || boss.x > app.screen.width - 50) {
          bossDirection *= -1;
        }

        bossBullets.forEach((bullet, index) => {
          bullet.y += 5;
          if (bullet.getBounds().y > app.screen.height) {
            app.stage.removeChild(bullet);
            bossBullets.splice(index, 1);
          }

          const rocketBounds = rocket.getBounds();
          const bulletBounds = bullet.getBounds();

          if (
            bulletBounds.x < rocketBounds.x + rocketBounds.width &&
            bulletBounds.x + bulletBounds.width > rocketBounds.x &&
            bulletBounds.y < rocketBounds.y + rocketBounds.height &&
            bulletBounds.y + bulletBounds.height > rocketBounds.y
          ) {
            clearInterval(bossShootInterval);
            app.stage.addChild(createText(app, false, 'YOU LOSE'));
            app.stop();
          }
        });

        bullets.forEach((bullet, index) => {
          const bulletBounds = bullet.getBounds();
          const bossBounds = boss.getBounds();

          if (
            bulletBounds.x < bossBounds.x + bossBounds.width &&
            bulletBounds.x + bulletBounds.width > bossBounds.x &&
            bulletBounds.y < bossBounds.y + bossBounds.height &&
            bulletBounds.y + bulletBounds.height > bossBounds.y
          ) {
            bullets.splice(index, 1);
            app.stage.removeChild(bullet);
            bossHP -= 1;
            bossHPBar.scale.x = bossHP / 4;

            if (bossHP <= 0) {
              clearInterval(bossShootInterval);
              app.stage.addChild(createText(app, true, 'YOU WIN'));
              app.stop();
            }
          }
        });
      });
    };

    const startAsteroidLevel = () => {
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
          setLevel(2);
          startBossLevel();
          return;
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
          asteroid.y += 0.4;
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
      });
    };

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

      if (level === 1) {
        startAsteroidLevel();
      }
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
  }, [start, level, setPlay]);

  return (
    <>
      <ShowCountBullets bullets={showCountBullets} limit={LIMIT_ASTEROIDS} />
      <ShowGameTime time={gameTime} />
      <div ref={canvasRef} />
    </>
  );
};

// asteriodIntervalId.current = setInterval(async () => {
//   if (asteroidsCreated >= LIMIT_ASTEROIDS) {
//     clearInterval(asteriodIntervalId.current);
//     return;
//   }

//   const asteroid = await createAsteroid();
//   app.stage.addChild(asteroid);
//   asteroids.push(asteroid);
//   asteroidsCreated += 1;
// }, 2500);

// app.ticker.add((time) => {
//   if (destroyedAsteroids === LIMIT_ASTEROIDS) {
// if (
//   !app.stage.children.find((item) => item?.renderPipeId === 'text')
// ) {
//   app.stage.addChild(textWin);
// }
// displayGameOverText(textWin);
//   }

//   if (
//     (destroyedAsteroids !== LIMIT_ASTEROIDS &&
//       bulletsFired === LIMIT_ASTEROIDS &&
//       bullets.length === 0) ||
//     (asteroidsCreated === LIMIT_ASTEROIDS &&
//       asteroids.length === 0 &&
//       bulletsFired < LIMIT_ASTEROIDS)
//   ) {
//     if (
//       !app.stage.children.find((item) => item?.renderPipeId === 'text')
//     ) {
//       app.stage.addChild(textLoss);
//     }
//     displayGameOverText(textLoss);
//   }
//   bullets.forEach((bullet, index) => {
//     bullet.y -= 10;

//     if (bullet.y < 0) {
//       app.stage.removeChild(bullet);
//       bullets.splice(index, 1);
//     }

//     asteroids.forEach((asteroid, asteroidIndex) => {
//       const boundsA = bullet.getBounds();
//       const boundsB = asteroid.getBounds();

//       if (
//         boundsA.x + boundsA.width > boundsB.x &&
//         boundsA.x < boundsB.x + boundsB.width &&
//         boundsA.y + boundsA.height > boundsB.y &&
//         boundsA.y < boundsB.y + boundsB.height
//       ) {
//         app.stage.removeChild(bullet);
//         bullets.splice(index, 1);
//         destroyedAsteroids += 1;

//         app.stage.removeChild(asteroid);
//         asteroids.splice(asteroidIndex, 1);
//       }
//     });
//   });

//   asteroids.forEach((asteroid, index) => {
//     if (asteroid.y > app.screen.height) {
//       app.stage.removeChild(asteroid);
//       asteroid.destroy();
//       asteroids.splice(index, 1);
//       return;
//     }
//     asteroid.y += asteroidImpacts;
//     asteroid.rotation += 0.01 * time.deltaTime;
//   });

//   if (keys['ArrowLeft'] && rocket.x > rocket.width / 2) {
//     rocket.x -= rocketSpeed;
//   }

//   if (
//     keys['ArrowRight'] &&
//     rocket.x < app.screen.width - rocket.width / 2
//   ) {
//     rocket.x += rocketSpeed;
//   }

//   bullets.forEach((bullet, index) => {
//     bullet.y += bulletSpeed;
//     if (bullet.y < 0) {
//       app.stage.removeChild(bullet);
//       bullets.splice(index, 1);
//     }
//   });
// });
