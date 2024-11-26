import { useEffect, useRef } from 'react';
import { Application, Graphics, Sprite, Assets } from 'pixi.js';
import { createRocket } from './elements/rocket';
import { createBullet } from './elements/bullet';

import rocketImage from './images/milkiway.jpg';

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const app = new Application();
    const rocket = createRocket();

    const bullets: Graphics[] = [];
    const bulletSpeed = -10;
    const rocketSpeed = 10;
    const keys: Record<string, boolean> = {};

    (async () => {
      await app.init({
        width: 1280,
        height: 720,
        backgroundColor: 0x000000,
      });

      const texture = await Assets.load(rocketImage);

      const sprite = new Sprite(texture);

      // Налаштовуємо розмір текстури для повного покриття екрану
      sprite.width = app.screen.width;
      sprite.height = app.screen.height;

      // app.stage.addChild(sprite);

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }

      rocket.x = app.screen.width / 2;
      rocket.y = app.screen.height - 90;
      app.stage.addChild(sprite, rocket);

      app.ticker.add(() => {
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
      <div ref={canvasRef} />
    </>
  );
}

export default App;
