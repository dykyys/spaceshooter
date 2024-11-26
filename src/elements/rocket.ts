import { Graphics, Container } from 'pixi.js';

export const createRocket = (): Container => {
  const rocket = new Container();

  const body = new Graphics().roundRect(-30, -100, 60, 150, 30).fill(0xffa500);

  rocket.addChild(body);

  const nose = new Graphics()
    .moveTo(0, -120)
    .lineTo(-30, -80)
    .lineTo(30, -80)
    .closePath()
    .fill(0x003366);

  rocket.addChild(nose);

  const windowOuter = new Graphics().circle(0, -40, 15).fill(0xffffff);

  rocket.addChild(windowOuter);

  const windowInner = new Graphics().circle(0, -40, 10).fill(0x87ceeb);

  rocket.addChild(windowInner);

  const leftFin = new Graphics().roundRect(-50, 30, 20, 50, 10).fill(0x003366);

  rocket.addChild(leftFin);

  const rightFin = new Graphics();
  rightFin.roundRect(30, 30, 20, 50, 10).fill(0x003366);

  rocket.addChild(rightFin);

  const centerFin = new Graphics()
    .moveTo(0, 30)
    .lineTo(-15, 80)
    .lineTo(15, 80)
    .closePath()
    .fill(0x003366);

  rocket.addChild(centerFin);

  return rocket;
};
