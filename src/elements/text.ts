import { Application, Color, FillGradient, Text, TextStyle } from 'pixi.js';

export const createText = (app: Application, message: string) => {
  const fill = new FillGradient(0, 0, 0, 36 * 1.7 * 7);

  const colors = ['#33ff55', '#33ccff'].map((color) =>
    Color.shared.setValue(color).toNumber()
  );

  colors.forEach((number, index) => {
    const ratio = index / colors.length;

    fill.addColorStop(ratio, number);
  });
  const style = new TextStyle({
    fontFamily: 'Orbitron',
    fontSize: 120,
    fontWeight: 'bold',
    fill: { fill },
    stroke: { color: '#000000', width: 2, join: 'round' },
    // strokeThickness: 2,
    letterSpacing: 5,
    dropShadow: {
      color: '#33ccff',
      blur: 20,
      angle: Math.PI / 6,
      distance: 10,
    },
    align: 'center',
  });
  const text = new Text({ text: message, style });

  text.anchor.set(0.5);
  text.scale.set(2);

  text.x = app.screen.width / 2;
  text.y = app.screen.height / 2;

  return text;
};
