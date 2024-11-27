import { ICountDestroyedAsteroids } from './CountDestroyedAsteroids.types';
import s from './CountDestroyedAsteroids.module.css';

export const CountDestroyedAsteroids = ({
  destroyedAsteroids,
}: ICountDestroyedAsteroids) => {
  return (
    <p className={s['bullets-counter']}>bullets: {destroyedAsteroids} / 10</p>
  );
};
