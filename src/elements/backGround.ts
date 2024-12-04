import { Sprite, Assets, Application } from 'pixi.js';
import rocketImage from '../images/milkiway.jpg';

interface IBackGround {
  app: Application;
}

export const backGround = async ({ app }: IBackGround): Promise<Sprite> => {
  const texture = await Assets.load(rocketImage);

  const sprite = new Sprite(texture);
  sprite.width = app.screen.width;
  sprite.height = app.screen.height;
  return sprite;
};
