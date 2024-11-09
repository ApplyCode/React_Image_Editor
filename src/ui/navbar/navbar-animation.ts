import {HTMLMotionProps} from 'framer-motion';

export const navbarAnimation: HTMLMotionProps<'div'> = {
  initial: {height: 0, opacity: 0},
  animate: {height: 120, opacity: 1},
  exit: {
    height: 0,
    opacity: 0,
    left: '16px',
    position: 'absolute',
    overflowY: 'hidden',
  },
  transition: {type: 'tween', duration: 0.15},
};
