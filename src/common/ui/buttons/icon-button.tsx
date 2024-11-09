import React, {forwardRef, ReactElement} from 'react';
import clsx from 'clsx';
import {ButtonSize, getButtonSizeStyle, getIconSizeStyle} from './button-size';
import {ButtonBase, ButtonBaseProps} from './button-base';

interface Props extends ButtonBaseProps {
  children: ReactElement;
  padding?: string;
  size?: ButtonSize;
  equalWidth?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      size,
      variant = 'text',
      radius = 'rounded-full',
      className,
      padding,
      equalWidth = true,
      ...other
    },
    ref
  ) => {
    const mergedClassName = clsx(
      getButtonSizeStyle(size, {padding, equalWidth}),
      className
    );
    const iconClass = clsx(children.props.className, getIconSizeStyle(size));

    return (
      <ButtonBase
        {...other}
        ref={ref}
        radius={radius}
        variant={variant}
        className={mergedClassName}
      >
        {React.cloneElement(children, {className: iconClass})}
      </ButtonBase>
    );
  }
);
