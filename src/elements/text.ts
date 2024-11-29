import { Application, Text, TextStyle } from 'pixi.js';

export const createText = (app: Application, type: boolean): Text => {
  const style = new TextStyle({
    fontFamily: 'Orbitron',
    fontSize: 120,
    fontWeight: 'bold',
    fill: type ? '#33ff55' : '#c61313',
    stroke: {
      color: '#11571d',
      width: 4,
      join: 'round',
    },
    letterSpacing: 5,
    dropShadow: {
      color: type ? '#33ff55' : '#c61313',
      blur: 20,
      angle: Math.PI / 6,
      distance: 2,
      alpha: 0.3,
    },
    align: 'center',
  });
  const text = new Text({
    text: type ? 'YOU WIN!!!' : 'YOU LOSS...😢',
    style,
  });

  text.anchor.set(0.5);
  text.scale.set(2);

  text.x = app.screen.width / 2;
  text.y = app.screen.height / 2;

  return text;
};
