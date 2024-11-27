import { IShowCountBullets } from './ShowCountBullets.types';
import s from './ShowCountBullets.module.css';

export const ShowCountBullets = ({ bullets }: IShowCountBullets) => {
  return <p className={s['bullets-counter']}>bullets: {bullets} / 10</p>;
};
