import { Graphics, Container } from 'pixi.js';
interface IRocet {
  width: number;
  height: number;
}
export const createRocket = ({ width, height }: IRocet): Container => {
  const rocket = new Container();

  const body = new Graphics().roundRect(-30, -100, 60, 150, 30).fill(0xffa500);

  const nose = new Graphics()
    .moveTo(0, -120)
    .lineTo(-30, -80)
    .lineTo(30, -80)
    .closePath()
    .fill(0x003366);

  const windowOuter = new Graphics().circle(0, -40, 15).fill(0xffffff);
  const windowInner = new Graphics().circle(0, -40, 10).fill(0x87ceeb);
  const leftFin = new Graphics().roundRect(-50, 30, 20, 50, 10).fill(0x003366);

  const rightFin = new Graphics().roundRect(30, 30, 20, 50, 10).fill(0x003366);

  const centerFin = new Graphics()
    .moveTo(0, 30)
    .lineTo(-15, 80)
    .lineTo(15, 80)
    .closePath()
    .fill(0x003366);

  rocket.addChild(
    body,
    nose,
    windowOuter,
    windowInner,
    leftFin,
    centerFin,
    rightFin
  );

  rocket.x = width / 2;
  rocket.y = height - 90;
  return rocket;
};
