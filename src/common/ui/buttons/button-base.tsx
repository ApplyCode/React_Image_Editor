import React, {CSSProperties, ReactNode, RefObject} from 'react';
import clsx from 'clsx';
import {AriaButtonProps} from '@react-types/button';
import {useFocusRing} from '@react-aria/focus';
import {useButton} from '@react-aria/button';
import {mergeProps} from '@react-aria/utils';
import {
  ButtonColor,
  getSharedButtonStyle,
  Variant,
} from './get-shared-button-style';

export interface ButtonBaseProps extends AriaButtonProps {
  children?: ReactNode;
  color?: ButtonColor;
  variant?: Variant;
  className?: string;
  value?: any;
  style?: CSSProperties;
  justify?: string;
  radius?:
    | 'rounded-none'
    | 'rounded'
    | 'rounded-sm'
    | 'rounded-md'
    | 'rounded-lg'
    | 'rounded-full'
    | 'rounded-xl'
    | 'rounded-2xl';
}

export const ButtonBase = React.forwardRef<
  HTMLButtonElement | HTMLLinkElement,
  ButtonBaseProps
>((props, ref) => {
  const {
    children,
    color = null,
    variant,
    radius,
    justify = 'justify-center',
    className,
    href,
    style,
  } = props;
  const {isFocusVisible, focusProps} = useFocusRing();
  const {buttonProps, isPressed} = useButton(
    {...props, elementType: href ? 'a' : 'button'},
    ref as RefObject<HTMLButtonElement>
  );

  const Element = href ? 'a' : 'button';

  return (
    <Element
      {...mergeProps(buttonProps, focusProps)}
      ref={ref as any}
      style={style}
      className={clsx(
        isPressed && 'translate-y-1',
        isFocusVisible && 'outline outline-offset-2',
        getSharedButtonStyle(variant, color),
        radius,
        justify,
        className
      )}
    >
      {children}
    </Element>
  );
});
