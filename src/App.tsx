import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
import { createRocket } from './elements/rocket';
function App() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const app = new Application();

    (async () => {
      await app.init({
        width: 1280,
        height: 720,
        backgroundColor: 0x000000,
      });

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }

      const rocket = createRocket();
      rocket.x = app.screen.width / 2;
      rocket.y = app.screen.height - 90;
      app.stage.addChild(rocket);
    })();
  }, []);

  return (
    <>
      <div ref={canvasRef} />
    </>
  );
}

export default App;
