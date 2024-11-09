import React, {useContext, useRef} from 'react';
import {CollectionChildren, Node} from '@react-types/shared';
import {ListCollection} from '@react-stately/list';
import {useTabPanel} from '@react-aria/tabs';
import {AriaTabPanelProps} from '@react-types/tabs';
import {FocusRing} from '@react-aria/focus';
import {useCollection} from '@react-stately/collections';
import {TabContext} from './tabs-context';

export interface TabPanelsProps<T = object> extends AriaTabPanelProps {
  children: CollectionChildren<T>;
  className?: string;
}
export function TabPanels<T>(props: TabPanelsProps<T>) {
  const {tabState, tabProps} = useContext(TabContext);
  const {tabListState} = tabState;

  const factory = (nodes: Iterable<Node<any>>) => new ListCollection(nodes);
  const collection = useCollection({items: tabProps.items, ...props}, factory, {
    suppressTextValueWarning: true,
  });
  const selectedItem = tabListState
    ? collection.getItem(tabListState.selectedKey)
    : null;

  return (
    <TabPanel {...props} key={tabListState?.selectedKey}>
      {selectedItem && selectedItem.props.children}
    </TabPanel>
  );
}

function TabPanel<T>(props: TabPanelsProps<T>) {
  const {children, className} = props;
  const {tabState} = useContext(TabContext);
  const ref = useRef<HTMLDivElement>(null);
  const {tabPanelProps} = useTabPanel(props, tabState.tabListState, ref);

  return (
    <FocusRing focusRingClass="outline-primary-light">
      <div className={className} {...tabPanelProps} ref={ref}>
        {children}
      </div>
    </FocusRing>
  );
}
