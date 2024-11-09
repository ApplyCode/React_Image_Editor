import {ReactNode} from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};
export function DialogBody({children, className}: Props) {
  return <div className={className}>{children}</div>;
}
