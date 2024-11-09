import React, {useRef} from 'react';
import {Node} from '@react-types/shared';
import {isFocusVisible, useHover} from '@react-aria/interactions';
import {useOption} from '@react-aria/listbox';
import {ListState} from '@react-stately/list';
import {mergeProps} from '@react-aria/utils';
import {listboxItemStyle} from './listbox-style';

interface OptionProps<T> {
  item: Node<T>;
  state: ListState<T>;
}

export function ListboxOption<T>(props: OptionProps<T>) {
  const {item, state} = props;
  const ref = useRef<HTMLLIElement>(null);
  const {optionProps, isDisabled, isSelected, isFocused} = useOption(
    {'aria-label': item['aria-label'], key: item.key},
    state,
    ref
  );
  const {hoverProps, isHovered} = useHover({
    ...props,
    isDisabled,
  });
  const isKeyboardModality = isFocusVisible();

  const className = listboxItemStyle({
    isFocused: isFocused && isKeyboardModality,
    isSelected,
    isDisabled,
    isHovered,
  });

  return (
    <li
      className={className}
      {...mergeProps(optionProps, hoverProps)}
      ref={ref}
    >
      {item.rendered}
    </li>
  );
}
