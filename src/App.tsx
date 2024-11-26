import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
function App() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = async () => {
      const app = new Application();
      await app.init({
        width: 1280,
        height: 720,
        backgroundColor: 0x000000,
      });

      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas);
      }
    };

    start();
  }, []);

  return (
    <>
      <div ref={canvasRef} />
    </>
  );
}

export default App;
