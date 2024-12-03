import { Assets, Sprite } from 'pixi.js';
import bossImage from '../images/boss.png';
interface IBoss {
  width: number;
  height: number;
}
export const createBoss = async ({ width, height }: IBoss): Promise<Sprite> => {
  const bossTexture = await Assets.load(bossImage);
  const boss = new Sprite(bossTexture);

  boss.anchor.set(0.5);
  boss.x = width / 2;
  boss.y = height / 4;

  boss.width = 100;
  boss.height = 100;

  return boss;
};
