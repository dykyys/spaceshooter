import { IStartGame } from './StartGame.types';

import startGame from '../../images/startGame.png';
import { Button } from '../../UX';

export const StartGame = ({ onClick }: IStartGame) => {
  return (
    <>
      <img src={startGame} alt="start game" />
      <Button onClick={onClick} text=" START NEW GAME" />
    </>
  );
};
