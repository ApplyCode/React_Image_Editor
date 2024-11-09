import React from 'react';
import clsx from 'clsx';
import {ButtonColor, Variant} from './get-shared-button-style';
import {ButtonProps} from './button';
import {ButtonSize} from './button-size';

interface Props {
  children: React.ReactNode[];
  color?: ButtonColor;
  variant?: Variant;
  size?: ButtonSize;
  radius?:
    | 'rounded-none'
    | 'rounded'
    | 'rounded-sm'
    | 'rounded-md'
    | 'rounded-lg'
    | 'rounded-full';
  className?: string;
  value?: any;
  onChange?: (newValue: any) => void;
  multiple?: boolean;
}

export function ButtonGroup({
  children,
  color,
  variant,
  radius,
  size,
  className,
  value,
  onChange,
  multiple,
}: Props) {
  const isActive = (childValue: any): boolean => {
    // assume that button group is not used as a toggle group, if there is no value given
    if (value === undefined) return false;
    if (multiple) {
      return (value as any[]).includes(childValue);
    }
    return childValue === value;
  };

  const toggleMultipleValue = (childValue: any) => {
    const newValue = [...value];
    const childIndex = value.indexOf(childValue);
    if (childIndex > -1) {
      newValue.splice(childIndex, 1);
    } else {
      newValue.push(childValue);
    }
    return newValue;
  };

  const buttons = React.Children.map(children, (button, i) => {
    if (React.isValidElement(button)) {
      const active = isActive(button.props.value);
      const adjustedColor = active ? 'primary' : color;
      return React.cloneElement<ButtonProps>(button, {
        color: active ? 'primary' : color,
        variant,
        size,
        radius: null,
        ...button.props,
        onPress: e => {
          if (button.props.onPress) {
            button.props.onPress(e);
          }
          if (!onChange) return;
          if (multiple) {
            onChange?.(toggleMultipleValue(button.props.value));
          } else {
            onChange?.(button.props.value);
          }
        },
        className: clsx(
          button.props.className,
          // borders are hidden via negative margin, make sure both are visible for active item
          active ? 'z-20' : 'z-10',
          getStyle(i, children, radius, adjustedColor)
        ),
      });
    }
  });
  return (
    <div className={clsx(radius, 'inline-flex isolate', className)}>
      {buttons}
    </div>
  );
}

function getStyle(
  i: number,
  children: Props['children'],
  radius: Props['radius'],
  color?: ButtonColor
): string {
  // first
  if (i === 0) {
    return clsx(
      radius,
      'rounded-tr-none rounded-br-none',
      !color && 'border-r-transparent disabled:border-r-transparent'
    );
  }
  // last
  if (i === children.length - 1) {
    return clsx(radius, 'rounded-tl-none rounded-bl-none -ml-1');
  }
  return clsx(
    'rounded-none -ml-1',
    !color && 'border-r-transparent disabled:border-r-transparent'
  );
}
