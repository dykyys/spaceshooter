import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Howl } from 'howler';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [gameResult, setGameResult] = useState<string | null>(null);

  useEffect(() => {
    // Ініціалізація PIXI.js
    const app = new PIXI.Application({
      width: 1280,
      height: 720,
      backgroundColor: 0x000000,
    });

    if (canvasRef.current) {
      canvasRef.current.appendChild(app.view);
    }

    // Звукові ефекти
    const shootSound = new Howl({ src: ['/sounds/shoot.mp3'] });
    const explosionSound = new Howl({ src: ['/sounds/explosion.mp3'] });
    const winSound = new Howl({ src: ['/sounds/win.mp3'] });
    const loseSound = new Howl({ src: ['/sounds/lose.mp3'] });

    // Змінні для гри
    const ship = PIXI.Sprite.from('/assets/ship.png');
    ship.anchor.set(0.5);
    ship.scale.set(0.7);
    ship.x = app.view.width / 2;
    ship.y = app.view.height - 80;
    app.stage.addChild(ship);

    const bullets: PIXI.Graphics[] = [];
    const asteroids: PIXI.Sprite[] = [];
    const asteroidTextures = ['/assets/asteroid1.png', '/assets/asteroid2.png'];
    let score = 0;
    let bulletsCount = 10;
    let level = 1;

    // Шкала HP для боса
    let bossHP = 4;
    const bossHPBar = new PIXI.Graphics();

    // Функція створення кулі
    const shootBullet = () => {
      if (bulletsCount <= 0) return;

      bulletsCount -= 1;
      const bullet = new PIXI.Graphics();
      bullet.beginFill(0xffffff);
      bullet.drawRect(0, 0, 4, 10);
      bullet.endFill();
      bullet.x = ship.x;
      bullet.y = ship.y - 20;

      bullets.push(bullet);
      app.stage.addChild(bullet);
      shootSound.play();
    };

    // Функція створення астероїда
    const createAsteroid = () => {
      const asteroid = PIXI.Sprite.from(
        asteroidTextures[Math.floor(Math.random() * asteroidTextures.length)]
      );
      asteroid.anchor.set(0.5);
      asteroid.scale.set(0.8);
      asteroid.x = Math.random() * app.view.width;
      asteroid.y = -50;

      asteroids.push(asteroid);
      app.stage.addChild(asteroid);
    };

    // Створення боса
    const createBoss = () => {
      const boss = PIXI.Sprite.from('/assets/boss.png');
      boss.anchor.set(0.5);
      boss.scale.set(1);
      boss.x = app.view.width / 2;
      boss.y = 100;
      app.stage.addChild(boss);

      // Додати шкалу HP
      bossHPBar.beginFill(0xff0000);
      bossHPBar.drawRect(0, 0, 200, 20);
      bossHPBar.endFill();
      bossHPBar.x = app.view.width / 2 - 100;
      bossHPBar.y = boss.y - 50;
      app.stage.addChild(bossHPBar);

      return boss;
    };

    let boss: PIXI.Sprite | null = null;

    // Ігровий цикл
    app.ticker.add(() => {
      bullets.forEach((bullet, index) => {
        bullet.y -= 10;

        // Видалення кулі, якщо вона виходить за екран
        if (bullet.y < 0) {
          app.stage.removeChild(bullet);
          bullets.splice(index, 1);
        }

        // Перевірка на зіткнення кулі з астероїдом
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
            explosionSound.play();

            score += 1;

            if (asteroids.length === 0 && level === 1) {
              level = 2;
              boss = createBoss();
            }
          }
        });

        // Перевірка на зіткнення кулі з босом
        if (boss) {
          const boundsA = bullet.getBounds();
          const boundsB = boss.getBounds();

          if (
            boundsA.x + boundsA.width > boundsB.x &&
            boundsA.x < boundsB.x + boundsB.width &&
            boundsA.y + boundsA.height > boundsB.y &&
            boundsA.y < boundsB.y + boundsB.height
          ) {
            app.stage.removeChild(bullet);
            bullets.splice(index, 1);

            bossHP -= 1;
            bossHPBar.width = (bossHP / 4) * 200;

            if (bossHP === 0) {
              app.stage.removeChild(boss);
              setGameResult('YOU WIN');
              winSound.play();
              app.stop();
            }
          }
        }
      });

      asteroids.forEach((asteroid) => {
        asteroid.y += 2;

        if (asteroid.y > app.view.height) {
          setGameResult('YOU LOSE');
          loseSound.play();
          app.stop();
        }
      });

      if (bulletsCount <= 0 && bullets.length === 0 && asteroids.length > 0) {
        setGameResult('YOU LOSE');
        loseSound.play();
        app.stop();
      }
    });

    return () => {
      app.destroy(true, true);
    };
  }, []);

  return (
    <div>
      {gameResult && <div className="game-result">{gameResult}</div>}
      <div ref={canvasRef} />
    </div>
  );
};

export default Game;
