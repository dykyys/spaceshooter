import { useEffect, useRef, useState } from 'react';
import { Application, Graphics, Sprite } from 'pixi.js';

import {
  createBullet,
  backGround,
  createRocket,
  createAsteroid,
  createText,
  createBoss,
  createBossHPBar,
} from '../../elements';

import {
  ShowCountBullets,
  ShowCountdown,
  ShowGameTime,
} from '../../components';

import { updateGameTime } from '../../helpers';

export const Game = ({ setPlay }: { setPlay: () => void }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  // const asteriodIntervalId = useRef<number>(0);
  const gameTimeIntervalId = useRef<number>(0);
  const clearGameTimeTimeoutId = useRef<number>(0);
  const [start, setStart] = useState(false);
  const [showCountBullets, setShowCountBullets] = useState(0);
  const [gameTime, setGameTime] = useState('00');
  const [level, setLevel] = useState(1);

  const [gameStarted, setGameStarted] = useState(false);

  const LIMIT_ASTEROIDS: number = 3;
  const WIDTH = 1280;
  const HEIGHT = 720;
  const BOSS_HP = 4;

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
    const rocket = createRocket({ width: WIDTH, height: HEIGHT });

    const bullets: Graphics[] = [];
    const asteroids: Sprite[] = [];
    const bossBullets: Graphics[] = [];
    const keys: Record<string, boolean> = {};

    const bulletSpeed = -10;
    const rocketSpeed = 10;

    let asteroidImpacts: number = 0.4;
    let bulletsFired: number = 0;
    // let destroyedAsteroids: number = 0;
    // let asteroidsCreated: number = 0;
    let gameOver: null | string = null;

    const startFirstLevel = () => {
      let destroyedAsteroids: number = 0;
      let asteroidsCreated: number = 0;

      const asteriodIntervalId = setInterval(async () => {
        if (asteroidsCreated >= LIMIT_ASTEROIDS) {
          clearInterval(asteriodIntervalId);
          return;
        }

        const asteroid = await createAsteroid();
        app.stage.addChild(asteroid);
        asteroids.push(asteroid);

        asteroidsCreated += 1;
      }, 2500);

      app.ticker.add((time) => {
        if (gameOver) {
          const text = createText({
            width: WIDTH,
            height: HEIGHT,
            type: gameOver === 'win' ? true : false,
            text: gameOver === 'win' ? 'You WIN!!!' : 'You LOSS...😥',
          });

          app.stage.addChild(text);

          displayGameOverText();
          return;
        }

        if (destroyedAsteroids === LIMIT_ASTEROIDS) {
          setTimeout(() => {
            setLevel(2);
          }, 5000);

          setGameStarted(true);
          clearInterval(gameTimeIntervalId.current);

          // startBossLevel();
          return;
        }

        if (
          (destroyedAsteroids !== LIMIT_ASTEROIDS &&
            bulletsFired === LIMIT_ASTEROIDS &&
            bullets.length === 0) ||
          (asteroidsCreated === LIMIT_ASTEROIDS &&
            asteroids.length === 0 &&
            bulletsFired < LIMIT_ASTEROIDS)
        ) {
          gameOver = 'loss';
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
    };
    const startBossLevel = async () => {
      const boss = await createBoss({ width: WIDTH, height: HEIGHT });
      const bossHPBar = createBossHPBar({ app, boss, maxHP: BOSS_HP });

      let bossHP = BOSS_HP;
      let bossDirection = 1;
      let bossSpeed = 2;

      app.stage.addChild(boss, bossHPBar.hpBarContainer);

      const bossShootInterval = setInterval(() => {
        const bossBullet = createBullet({
          body: boss,
          color: '0xff0000',
          type: 'boss',
        });
        bossBullets.push(bossBullet);
        app.stage.addChild(bossBullet);
      }, 2000);

      app.ticker.add(() => {
        if (gameOver) {
          clearInterval(bossShootInterval);
          clearTimeout(gameTimeIntervalId.current);
          if (
            !app.stage.children.find((item) => item?.renderPipeId === 'text')
          ) {
            const text = createText({
              width: WIDTH,
              height: HEIGHT,
              type: gameOver === 'win' ? true : false,
              text: gameOver === 'win' ? 'You WIN!!!' : 'You LOSS...😥',
            });
            app.stage.addChild(text);
          }
          displayGameOverText();
          return;
        }

        boss.x += bossDirection * bossSpeed;

        if (boss.x < 50 || boss.x > app.screen.width - 50) {
          bossDirection *= -1;
          bossSpeed = Math.ceil(Math.random() * 5);
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
            // clearInterval(bossShootInterval);
            // app.stage.addChild(textLoss);
            gameOver = 'loss';
            // app.stop();
          }
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
            bossHPBar.updateHP(bossHP);

            if (bossHP <= 0) {
              clearInterval(bossShootInterval);

              gameOver = 'win';
            }
          }
        });

        bullets.forEach((bullet, index) => {
          bullet.y += bulletSpeed;
          if (bullet.y < 0) {
            app.stage.removeChild(bullet);
            bullets.splice(index, 1);
          }
        });
      });
    };

    const displayGameOverText = () => {
      const text = app.stage.children.find(
        (item) => item.renderPipeId === 'text'
      )!;
      // clearInterval(asteriodIntervalId.current);
      // clearInterval(gameTimeIntervalId.current);
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
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: 0x000000,
      });

      const sprite = await backGround(app);

      app.stage.addChild(sprite, rocket);

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }

      if (level === 1) {
        startFirstLevel();
      } else {
        setGameTime('00');
        startBossLevel();
      }
    })();

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;

      if (e.code === 'Space') {
        if (bulletsFired === 10) {
          return;
        }
        bulletsFired += 1;

        const bullet = createBullet({
          body: rocket,
          color: '0xffffff',
          type: 'rocet',
        });
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
  }, [setPlay, level, start]);
  console.log(gameStarted);
  return (
    <>
      {gameStarted && (
        <ShowCountdown
          onComplete={() => setGameStarted(false)}
          message="Kill 🔫"
        />
      )}
      <ShowCountBullets bullets={showCountBullets} limit={LIMIT_ASTEROIDS} />
      <ShowGameTime time={gameTime} />
      <div ref={canvasRef} />
    </>
  );
};
