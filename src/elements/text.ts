import { Text, TextStyle } from 'pixi.js';

interface IText {
  width: number;
  height: number;
  type: boolean;
  text: string;
}

export const createText = ({ width, height, type, text }: IText): Text => {
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
  const message = new Text({
    text,
    style,
  });

  message.anchor.set(0.5);
  message.scale.set(2);

  message.x = width / 2;
  message.y = height / 2;

  return message;
};
