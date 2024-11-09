import React, {useContext, useRef} from 'react';
import {AriaCheckboxProps} from '@react-types/checkbox';
import clsx from 'clsx';
import {useToggleState} from '@react-stately/toggle';
import {useCheckbox, useCheckboxGroupItem} from '@react-aria/checkbox';
import {useFocusRing} from '@react-aria/focus';
import {VisuallyHidden} from '@react-aria/visually-hidden';
import {InputSize} from '../input-field/input-size';
import {inputFieldStyle} from '../input-field/input-field-style';
import {CheckBoxOutlineBlankIcon} from '../../../icons/material/CheckBoxOutlineBlank';
import {CheckboxFilledIcon} from './checkbox-icon';
import {CheckboxGroupContext} from './checkbox-group-context';

export interface CheckboxProps extends AriaCheckboxProps {
  size?: InputSize;
  className?: string;
  icon?: React.ComponentType;
  checkedIcon?: React.ComponentType;
}
export function Checkbox(props: CheckboxProps) {
  const {children, className, icon, checkedIcon, isDisabled, value} = props;
  const style = inputFieldStyle({...props, label: children});
  const Icon = icon || CheckBoxOutlineBlankIcon;
  const CheckedIcon = checkedIcon || CheckboxFilledIcon;

  const ref = useRef<HTMLInputElement>(null);
  const {isFocusVisible, focusProps} = useFocusRing();

  // Swap hooks depending on whether this checkbox is inside a CheckboxGroup.
  // This is a bit unorthodox. Typically, hooks cannot be called in a conditional,
  // but since the checkbox won't move in and out of a group, it should be safe.
  const groupState = useContext(CheckboxGroupContext);
  const {inputProps} = groupState
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckboxGroupItem(
        {
          ...props,
          // Value is optional for standalone checkboxes, but required for CheckboxGroup items;
          // it's passed explicitly here to avoid typescript error (requires strictNullChecks disabled).
          value: value!,
        },
        groupState,
        ref
      )
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckbox(props, useToggleState(props), ref);

  const mergedClassName = clsx('flex items-center rounded', className, {
    'outline outline-offset-2': isFocusVisible,
  });

  const disabledStyle = isDisabled && 'text-disabled';

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={mergedClassName}>
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      {inputProps.checked ? (
        <CheckedIcon
          className={clsx(disabledStyle || 'text-primary', style.adornment)}
        />
      ) : (
        <Icon
          className={clsx(disabledStyle || 'text-muted', style.adornment)}
        />
      )}
      {children && (
        <div className={clsx('block capitalize ml-6', style.size.font)}>
          {children}
        </div>
      )}
    </label>
  );
}
