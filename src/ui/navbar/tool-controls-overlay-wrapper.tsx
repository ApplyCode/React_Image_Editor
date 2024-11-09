import React from 'react';
import clsx from 'clsx';

type Props = {
  actionBtn?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export function ToolControlsOverlayWrapper({
  actionBtn,
  children,
  className,
}: Props) {
  return (
    <div className={clsx(className, 'flex flex-col gap-10 items-center')}>
      <div></div>
      {actionBtn && <div className="flex-shrink-0 mt-10">{actionBtn}</div>}
      <div className="w-full flex-auto">{children}</div>
    </div>
  );
}
