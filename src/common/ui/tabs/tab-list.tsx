import React, {useContext} from 'react';
import {DOMProps, ItemElement, StyleProps} from '@react-types/shared';
import {useTabList} from '@react-aria/tabs';
import clsx from 'clsx';
import {TabContext} from './tabs-context';
import {Tab} from './tab';
import {TabLine} from './tab-line';

export interface TabListProps<T = object> extends DOMProps, StyleProps {
  children: (any | ItemElement<T>)[];
}
export function TabList<T>(props: TabListProps<T>) {
  const tabContext = useContext(TabContext);
  const {refs, tabState, tabProps} = tabContext;
  const {selectedTab, tabListState: state} = tabState;
  const {tablistRef} = refs;
  const {tabListProps} = useTabList({...tabProps, ...props}, state, tablistRef);
  return (
    <div
      className={clsx(
        'flex relative max-w-full overflow-auto hide-scrollbar',
        tabContext.tabProps.orientation === 'vertical' ? 'flex-col' : 'flex-row'
      )}
      {...tabListProps}
      ref={tablistRef}
    >
      {[...state.collection].map((item, index) => {
        return <Tab key={item.key} item={item} state={state} />;
      })}
      <TabLine selectedTab={selectedTab} />
    </div>
  );
}
