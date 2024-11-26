import { Sprite, Assets } from 'pixi.js';
import asteroidImage from '../images/asteroid.png';

export const createAsteroid = async () => {
  const texture = await Assets.load(asteroidImage);

  const sprite = new Sprite(texture);
  sprite.anchor.set(0.5);
  sprite.x = Math.floor(Math.random() * 1200);
  sprite.y = 0;
  sprite.scale = 0.1;
  return sprite;
};
