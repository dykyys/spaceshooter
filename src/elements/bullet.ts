import { Graphics, Container } from 'pixi.js';

interface IBullet {
  body: Container;
  color: string;
  type: string;
}
export const createBullet = ({ body, color, type }: IBullet): Graphics => {
  const bullet = new Graphics();
  bullet.rect(0, 0, 5, 15);
  bullet.fill(color);
  bullet.x = body.x - (type === 'rocet' ? 2.5 : 2);
  bullet.y = body.y - (type === 'rocet' ? 115 : -45);
  return bullet;
};
