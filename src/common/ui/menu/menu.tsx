import {
  AriaLabelingProps,
  CollectionBase,
  DOMProps,
  FocusStrategy,
  MultipleSelection,
} from '@react-types/shared';
import React, {Key, useContext} from 'react';
import {mergeProps} from '@react-aria/utils';
import {useTreeState} from '@react-stately/tree';
import {useMenu} from '@react-aria/menu';
import {MenuContext} from './menu-context';
import {MenuItem} from './menu-item';
import {listboxWrapperStyle} from '../inputs/listbox/listbox-style';

export interface MenuProps<T> extends CollectionBase<T>, MultipleSelection {
  /** Where the focus should be set. */
  autoFocus?: boolean | FocusStrategy;
  /** Whether keyboard navigation is circular. */
  shouldFocusWrap?: boolean;
  /** Handler that is called when an item is selected. */
  onAction?: (key: Key) => void;
}

interface Props<T> extends MenuProps<T>, DOMProps, AriaLabelingProps {}
export function Menu<T extends object>(props: Props<T>) {
  const className = listboxWrapperStyle();
  const contextProps = useContext(MenuContext);
  const mergedProps = {
    ...mergeProps(contextProps, props),
  };
  const state = useTreeState(mergedProps);
  const {menuProps} = useMenu(mergedProps, state, mergedProps.ref);

  return (
    <ul className={className} {...menuProps} ref={mergedProps.ref}>
      {[...state.collection].map(item => {
        let menuItem = (
          <MenuItem
            key={item.key}
            item={item}
            state={state}
            onAction={mergedProps.onAction}
          />
        );

        if (item.wrapper) {
          menuItem = item.wrapper(menuItem);
        }

        return menuItem;
      })}
    </ul>
  );
}
