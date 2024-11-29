import { Sprite, Assets, Application } from 'pixi.js';
import rocketImage from '../images/milkiway.jpg';

export const backGround = async (app: Application): Promise<Sprite> => {
  const texture = await Assets.load(rocketImage);

  const sprite = new Sprite(texture);
  sprite.width = app.screen.width;
  sprite.height = app.screen.height;
  return sprite;
};
