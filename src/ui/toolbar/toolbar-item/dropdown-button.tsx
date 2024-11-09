import {Item} from '@react-stately/collections';
import React, {ReactElement} from 'react';
import type {MenubarItemProps} from './toolbar-item';
import {MenuTrigger} from '../../../common/ui/menu/menu-trigger';
import {Menu} from '../../../common/ui/menu/menu';

interface DropdownButtonProps extends MenubarItemProps {
  button: ReactElement;
}

export function DropdownButton({item, button}: DropdownButtonProps) {
  const menuItems = item.menuItems!;
  return (
    <MenuTrigger>
      {button}
      <Menu
        onAction={label => {
          const menuItem = menuItems.find(i => i.label === label);
          menuItem?.action();
        }}
        items={menuItems}
      >
        {menuItem => <Item key={menuItem.label}>{menuItem.label}</Item>}
      </Menu>
    </MenuTrigger>
  );
}
