import React from 'react';

type AdornmentProps = {
  children: React.ReactNode;
  direction: 'start' | 'end';
};

export function Adornment({children, direction}: AdornmentProps) {
  const dirClass = direction === 'start' ? 'left-12' : 'right-12';
  if (!children) return null;
  return (
    <div className={`absolute h-full flex items-center ${dirClass} top-0`}>
      {children}
    </div>
  );
}
