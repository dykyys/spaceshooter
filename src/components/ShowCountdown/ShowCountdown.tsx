import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import s from './ShowCountdown.module.css';
import { IShowCountdown } from './ShowCountdown.types';

export const ShowCountdown = ({ onComplete }: IShowCountdown) => {
  const [count, setCount] = useState<number>(3);
  const numberRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const animateCountdown = async () => {
      const timeline = gsap.timeline();

      for (let i = count; i >= 0; i--) {
        setCount(i);

        await new Promise((resolve) => {
          timeline
            .to(numberRef.current, {
              scale: 4,
              opacity: 0.6,
              duration: 0.5,
              ease: 'power3.out',
            })
            .to(numberRef.current, {
              scale: 0.5,
              opacity: 0,
              duration: 0.5,
              ease: 'power3.in',
              onComplete: resolve,
            });
        });
      }
    };

    animateCountdown();

    return () => {
      if (count === 0) onComplete();
    };
  }, [count, onComplete]);

  return (
    <div ref={containerRef} className={s.box}>
      <div ref={numberRef} className={s.wrapper}>
        {count > 0 ? count : 'GO!'}
      </div>
    </div>
  );
};
