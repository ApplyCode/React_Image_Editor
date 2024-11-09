import {Node} from '@react-types/shared';
import React, {Key, useRef} from 'react';
import {useMenuItem} from '@react-aria/menu';
import {useFocusRing} from '@react-aria/focus';
import {useHover} from '@react-aria/interactions';
import {TreeState} from '@react-stately/tree';
import {mergeProps} from '@react-aria/utils';
import {listboxItemStyle} from '../inputs/listbox/listbox-style';
import {useMenuContext} from './menu-context';

interface MenuItemProps<T> {
  item: Node<T>;
  state: TreeState<T>;
  onAction?: (key: Key) => void;
}
export function MenuItem<T>(props: MenuItemProps<T>) {
  const {item, state, onAction} = props;
  const {onClose, closeOnSelect} = useMenuContext();

  const {rendered, key} = item;

  const isSelected = state.selectionManager.isSelected(key);
  const isDisabled = state.disabledKeys.has(key);

  const ref = useRef<HTMLLIElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {menuItemProps, labelProps, descriptionProps, keyboardShortcutProps} =
    useMenuItem(
      {
        isSelected,
        isDisabled,
        'aria-label': item['aria-label'],
        key,
        onClose,
        closeOnSelect,
        onAction,
      },
      state,
      ref
    );
  const {hoverProps, isHovered} = useHover({isDisabled});
  const {focusProps, isFocusVisible} = useFocusRing();
  const className = listboxItemStyle({
    isFocused: isFocusVisible,
    isSelected,
    isDisabled,
    isHovered,
  });

  return (
    <li
      className={className}
      {...mergeProps(menuItemProps, hoverProps, focusProps)}
      ref={ref}
    >
      <div {...labelProps}>{rendered}</div>
    </li>
  );
}
