import React, {ReactElement} from 'react';
import clsx from 'clsx';
import {ButtonSize, getButtonSizeStyle, getIconSizeStyle} from './button-size';
import {ButtonBase, ButtonBaseProps} from './button-base';

export interface ButtonProps extends ButtonBaseProps {
  size?: ButtonSize;
  equalWidth?: boolean;
  startIcon?: ReactElement | null;
  endIcon?: ReactElement;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      startIcon,
      endIcon,
      size,
      className,
      equalWidth = false,
      radius = 'rounded',
      variant = 'flat',
      ...other
    },
    ref
  ) => {
    const mergedClassName = clsx(
      'font-semibold',
      getButtonSizeStyle(size, {equalWidth}),
      className
    );
    const iconSize = getIconSizeStyle(size);
    return (
      <ButtonBase
        className={mergedClassName}
        ref={ref}
        radius={radius}
        variant={variant}
        {...other}
      >
        {startIcon && (
          <InlineIcon position="start" icon={startIcon} size={iconSize} />
        )}
        {children}
        {endIcon && (
          <InlineIcon position="end" icon={endIcon} size={iconSize} />
        )}
      </ButtonBase>
    );
  }
);

type InlineIconProps = {
  icon: ReactElement;
  position: 'start' | 'end';
  size?: string;
};
function InlineIcon({icon, position, size}: InlineIconProps): ReactElement {
  const className = clsx(
    'm-auto',
    size,
    {
      '-ml-4 mr-8': position === 'start',
      '-mr-4 ml-8': position === 'end',
    },
    icon.props.className
  );
  return React.cloneElement(icon, {className});
}
