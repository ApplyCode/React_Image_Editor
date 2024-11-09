type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type Props = {
  position: Position;
  inset?: boolean;
};

export function CornerHandle({position, inset = false}: Props) {
  const className = getPositionClass(position, inset);
  return (
    <div
      data-position={position}
      className={`border-white absolute w-20 h-20 ${className}`}
    />
  );
}

function getPositionClass(position: Position, inset: boolean): string {
  const left = inset ? 'left-0' : '-left-5';
  const top = inset ? 'top-0' : '-top-5';
  const bottom = inset ? 'bottom-0' : '-bottom-5';
  const right = inset ? 'right-0' : '-right-5';
  switch (position) {
    case 'top-left':
      return `${left} ${top} border-l-4 border-t-4 cursor-nwse-resize`;
    case 'top-right':
      return `${right} ${top} border-r-4 border-t-4 cursor-nesw-resize`;
    case 'bottom-right':
      return `${right} ${bottom} border-r-4 border-b-4 cursor-se-resize`;
    case 'bottom-left':
      return `${left} ${bottom} border-l-4 border-b-4 cursor-sw-resize`;
    default:
      return '';
  }
}
