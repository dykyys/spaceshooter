import { IShowGameTime } from './ShowGameTime.types';
import s from './ShowGameTime.module.css';

export const ShowGameTime = ({ time }: IShowGameTime) => {
  return <p className={s['time-counter']}>{time}</p>;
};
