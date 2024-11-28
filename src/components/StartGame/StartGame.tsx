import s from './StartGame.module.css';
import { IStartGame } from './StartGame.types';

import startGame from '../../images/startGame.png';

export const StartGame = ({ onClick }: IStartGame) => {
  return (
    <div>
      <img src={startGame} alt="start game" />

      <button className={s.startBtn} onClick={onClick}>
        START NEW GAME
      </button>
    </div>
  );
};
