import { Sprite, Assets } from 'pixi.js';
import rocketImage from '../images/milkiway.jpg';

export const backGround = async () => {
  const texture = await Assets.load(rocketImage);

  const sprite = new Sprite(texture);
  return sprite;
};
