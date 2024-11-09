import React, {RefObject} from 'react';
import {TabListState} from '@react-stately/tabs';
import type {TabsProps} from './tabs';

interface TabsContext<T> {
  tabProps: TabsProps<T>;
  tabState: {
    tabListState: TabListState<T>;
    selectedTab: HTMLElement;
  };
  refs: {
    tablistRef: RefObject<HTMLDivElement>;
  };
}

export const TabContext = React.createContext<TabsContext<any>>(null!);
