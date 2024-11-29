import { Graphics, Container } from 'pixi.js';

export const createBullet = (rocket: Container): Graphics => {
  const bullet = new Graphics();
  bullet.rect(0, 0, 5, 15);
  bullet.fill(0xffffff);
  bullet.x = rocket.x - 2.5;
  bullet.y = rocket.y - 115;
  return bullet;
};
