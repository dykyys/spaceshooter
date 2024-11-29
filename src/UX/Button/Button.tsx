import clsx from 'clsx';
import s from './Button.module.css';

import { IButton } from './Button.types';

export const Button = ({ onClick, text, type }: IButton) => {
  return (
    <button className={clsx(s.btn, { [s.center]: type })} onClick={onClick}>
      {text}
    </button>
  );
};
