import {HTMLAttributes, ReactNode} from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  titleProps?: HTMLAttributes<HTMLElement>;
};
export function DialogHeader({children, className, titleProps}: Props) {
  return (
    <h3 {...titleProps} className={className}>
      {children}
    </h3>
  );
}
