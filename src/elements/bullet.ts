import { Graphics } from 'pixi.js';

export const createBullet = (): Graphics => {
  const bullet = new Graphics();
  bullet.rect(0, 0, 5, 15);
  bullet.fill(0xffffff);
  return bullet;
};
