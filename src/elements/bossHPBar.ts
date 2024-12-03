import { Application, Container, Graphics, Sprite } from 'pixi.js';

interface IBossHPBar {
  app: Application;
  boss: Sprite;
  maxHP: number;
}

export const createBossHPBar = ({ app, boss, maxHP }: IBossHPBar) => {
  const hpBarContainer = new Container();

  const barWidth = 100;
  const barHeight = 10;

  const backgroundBar = new Graphics()
    .rect(0, 0, barWidth, barHeight)
    .fill(0x555555);

  const foregroundBar = new Graphics()
    .rect(0, 0, barWidth, barHeight)
    .fill(0x00ff00);

  hpBarContainer.addChild(backgroundBar, foregroundBar);

  hpBarContainer.x = boss.x - barWidth / 2;
  hpBarContainer.y = boss.y - boss.height / 2 - barHeight - 5;

  app.ticker.add(() => {
    hpBarContainer.x = boss.x - barWidth / 2;
    hpBarContainer.y = boss.y - boss.height / 2 - barHeight - 5;
  });

  const updateHP = (currentHP: number) => {
    const hpPercentage = currentHP / maxHP;
    foregroundBar
      .clear()
      .rect(0, 0, barWidth * hpPercentage, barHeight)
      .fill(0x00ff00);
  };

  return { hpBarContainer, updateHP };
};
