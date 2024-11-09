export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function getButtonSizeStyle(
  size?: ButtonSize,
  {padding, equalWidth}: {padding?: string; equalWidth?: boolean} = {}
): string {
  switch (size) {
    case 'xs':
      return `text-xs h-30 ${equalWidth ? 'w-30' : padding || 'px-14'}`;
    case 'sm':
      return `text-sm h-36 ${equalWidth ? 'w-36' : padding || 'px-18'}`;
    case 'lg':
      return `text-lg h-50 ${equalWidth ? 'w-50' : padding || 'px-26'}`;
    case 'xl':
      return `text-xl h-60 ${equalWidth ? 'w-60' : padding || 'px-32'}`;
    case 'md':
      return `text-base h-42 ${equalWidth ? 'w-42' : padding || 'px-22'}`;
    default:
      return '';
  }
}

export function getIconSizeStyle(size?: ButtonSize): string {
  switch (size) {
    case 'xs':
      return 'icon-xs';
    case 'sm':
      return 'icon-sm';
    case 'md':
      return 'icon-md';
    case 'lg':
      return 'icon-lg';
    case 'xl':
      return 'icon-xl';
    default:
      return '';
  }
}
