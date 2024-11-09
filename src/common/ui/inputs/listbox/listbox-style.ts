import clsx from 'clsx';

export function listboxWrapperStyle(className?: string): string {
  return clsx(
    'p-4 overflow-y-auto text-base sm:text-sm outline-none max-h-inherit',
    className
  );
}

interface Props {
  isFocused: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isHovered: boolean;
}
export function listboxItemStyle({
  isFocused,
  isSelected,
  isDisabled,
  isHovered,
}: Props): string {
  let action: string = '';
  if (isDisabled) {
    action = 'text-disabled pointer-events-none';
  } else if (isSelected) {
    if (isHovered || isFocused) {
      action = 'bg-primary/focus';
    } else {
      action = 'bg-primary/selected';
    }
  } else if (isFocused) {
    action = 'bg-focus';
  } else if (isHovered) {
    action = 'bg-hover';
  }

  return clsx(
    'px-16 py-8 text-sm truncate select-none outline-none rounded cursor-pointer',
    action
  );
}
