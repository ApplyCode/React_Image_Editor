import {m} from 'framer-motion';

interface UnderlayProps {
  disableInitialTransition?: boolean;
  position?: 'fixed' | 'absolute';
}
export function Underlay({disableInitialTransition, position}: UnderlayProps) {
  return (
    <m.div
      className={`w-full h-full bg-black/30 ${
        position || 'absolute'
      } top-0 left-0 z-10`}
      aria-hidden
      initial={{opacity: disableInitialTransition ? 1 : 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.3}}
    />
  );
}
