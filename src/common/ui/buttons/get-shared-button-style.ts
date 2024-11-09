export type Variant = 'text' | 'flat' | 'raised' | 'outline' | null;
export type ButtonColor = null | 'primary' | 'error' | 'paper';

export function getSharedButtonStyle(
  variant?: Variant,
  color?: ButtonColor
): (string | boolean | null | undefined)[] {
  let style: string[] = [];
  if (variant === 'outline') {
    style = outline(color);
  } else if (variant === 'text') {
    style = text(color);
  } else if (variant === 'flat' || variant === 'raised') {
    style = contained(color);
  }
  return [
    ...style,
    variant === 'raised' && 'shadow-md',
    variant &&
      'align-middle whitespace-nowrap inline-flex items-center transition-button duration-200',
    'select-none appearance-none no-underline outline-none disabled:pointer-events-none disabled:cursor-default',
  ];
}

function outline(color?: ButtonColor) {
  const disabled =
    'disabled:text-disabled disabled:bg-transparent disabled:border-disabled-bg';
  switch (color) {
    case 'primary':
      return [
        'text-primary bg-transparent border border-primary/50',
        'hover:bg-primary/hover hover:border-primary',
        disabled,
      ];
    case 'error':
      return [
        'text-error bg-transparent border border-error/50',
        'hover:bg-error/4 hover:border-error',
        disabled,
      ];
    case 'paper':
      return ['text bg-paper border', 'hover:bg-hover', disabled];
    default:
      return ['text-current bg-transparent border', 'hover:bg-hover', disabled];
  }
}

function text(color?: ButtonColor) {
  const disabled = 'disabled:text-disabled disabled:bg-transparent';
  switch (color) {
    case 'primary':
      return [
        'text-primary bg-transparent border-transparent',
        'hover:bg-primary/4',
        disabled,
      ];
    case 'error':
      return [
        'text-error bg-transparent border-transparent',
        'hover:bg-error/4',
        disabled,
      ];
    default:
      return [
        'text-current bg-transparent border-transparent',
        'hover:bg-hover',
        disabled,
      ];
  }
}

function contained(color?: ButtonColor) {
  const disabled =
    'disabled:text-disabled disabled:bg-disabled disabled:border-transparent disabled:shadow-none';
  switch (color) {
    case 'primary':
      return [
        'text-on-primary bg-primary border border-primary',
        'hover:bg-primary-dark hover:border-primary-dark',
        disabled,
      ];
    case 'error':
      return [
        'text-on-error bg-error border border-error',
        'hover:bg-error/90 hover:border-error/90',
        disabled,
      ];
    default:
      return ['text-current bg border-background', 'hover:bg-hover', disabled];
  }
}
