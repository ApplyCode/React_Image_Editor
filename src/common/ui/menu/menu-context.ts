import React, {HTMLAttributes, RefObject, useContext} from 'react';
import {FocusStrategy} from '@react-types/shared';

export interface MenuContextValue extends HTMLAttributes<HTMLElement> {
  onClose?: () => void;
  closeOnSelect?: boolean;
  shouldFocusWrap?: boolean;
  autoFocus?: boolean | FocusStrategy;
  ref: RefObject<HTMLUListElement>;
}

export const MenuContext = React.createContext<MenuContextValue>(null!);

export function useMenuContext(): MenuContextValue {
  return useContext(MenuContext);
}
