import { Sprite, Assets } from 'pixi.js';
import asteroidImage from '../images/asteroid.png';

export const createAsteroid = async (): Promise<Sprite> => {
  const texture = await Assets.load(asteroidImage);

  const sprite = new Sprite(texture);
  sprite.anchor.set(0.5);
  sprite.x = Math.floor(Math.random() * 1000);
  sprite.y = 0;
  sprite.scale = 0.17;
  return sprite;
};
