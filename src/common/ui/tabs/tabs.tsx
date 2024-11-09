import {DOMProps, SingleSelection, StyleProps} from '@react-types/shared';
import React, {Key, ReactElement, useEffect, useRef, useState} from 'react';
import {filterDOMProps} from '@react-aria/utils';
import {useTabListState} from '@react-stately/tabs';
import clsx from 'clsx';
import {TabContext} from './tabs-context';
import {TabListProps} from './tab-list';
import {TabPanelsProps} from './tab-panels';

export interface TabsProps<T> extends SingleSelection, DOMProps, StyleProps {
  children: [ReactElement<TabListProps>, ReactElement<TabPanelsProps>];
  items?: Iterable<T>;
  disabledKeys?: Iterable<Key>;
  size?: 'sm' | 'md';
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Tabs<T extends object>(props: TabsProps<T>) {
  const {
    size = 'md',
    orientation = 'horizontal',
    children,
    className,
    ...otherProps
  } = props;

  const domRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);

  const [selectedTab, setSelectedTab] = useState<HTMLElement>(null!);

  const tabListState = useTabListState({
    ...props,
    children: children[0].props.children,
  });

  useEffect(() => {
    if (tablistRef.current) {
      const selectedTabEl = tablistRef.current.querySelector(
        `[data-key="${tabListState?.selectedKey}"]`
      );

      if (selectedTabEl != null) {
        setSelectedTab(selectedTabEl as HTMLElement);
      }
    }
  }, [children, tabListState?.selectedKey, tablistRef]);

  return (
    <TabContext.Provider
      value={{
        tabProps: {...props, size, orientation},
        tabState: {tabListState, selectedTab},
        refs: {tablistRef},
      }}
    >
      <div
        className={clsx(
          className,
          'max-w-full overflow-hidden',
          orientation === 'vertical' && 'flex-col'
        )}
        {...filterDOMProps(otherProps)}
        ref={domRef}
      >
        {children}
      </div>
    </TabContext.Provider>
  );
}
