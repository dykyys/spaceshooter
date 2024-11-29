import { IShowCountBullets } from './ShowCountBullets.types';
import s from './ShowCountBullets.module.css';

export const ShowCountBullets = ({ bullets, limit }: IShowCountBullets) => {
  return (
    <p className={s['bullets-counter']}>
      bullets: {bullets} /{limit}
    </p>
  );
};
