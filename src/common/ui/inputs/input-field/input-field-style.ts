import clsx from 'clsx';
import {InputSize} from './input-size';
import {CommonInputFieldProps} from './input-field-props';
import {getIconSizeStyle} from '../../buttons/button-size';

export function inputFieldStyle(props: CommonInputFieldProps): {
  label: string;
  input: string;
  wrapper: string;
  adornment: string;
  size: {font: string; height: string};
} {
  const {
    size = 'md',
    startAdornment,
    endAdornment,
    className,
    inline,
  } = {...props};
  const sizeClass = inputSizeClass(size);

  return {
    label: clsx(
      'block capitalize text-left text-xs',
      inline ? 'mr-16' : 'mb-4'
    ),
    input: clsx(
      'text-left relative focus:ring focus:ring-primary/focus focus:border-primary/60 block w-full bg-transparent border rounded focus:outline-none shadow-sm appearance-none transition-shadow',
      sizeClass.font,
      sizeClass.height,
      startAdornment ? 'pl-36' : 'pl-12',
      endAdornment ? 'pr-36' : 'pr-12'
    ),
    adornment: getIconSizeStyle(size),
    wrapper: clsx(className, sizeClass.font, {
      'flex items-center': inline,
    }),
    size: sizeClass,
  };
}

export const DEFAULT_INPUT_FONT_SIZE = 'text-base';

function inputSizeClass(size?: InputSize) {
  switch (size) {
    case 'xs':
      return {font: 'text-xs', height: 'h-30'};
    case 'sm':
      return {font: 'text-sm', height: 'h-36'};
    case 'lg':
      return {font: 'text-lg', height: 'h-50'};
    case 'xl':
      return {font: 'text-xl', height: 'h-60'};
    default:
      return {font: DEFAULT_INPUT_FONT_SIZE, height: 'h-42'};
  }
}
