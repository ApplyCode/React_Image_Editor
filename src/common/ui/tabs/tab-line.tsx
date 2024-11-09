import React, {Key, useContext, useState} from 'react';
import {useLayoutEffect} from '@react-aria/utils';
import {TabContext} from './tabs-context';

interface TabLineProps {
  selectedTab?: HTMLElement;
  selectedKey?: Key;
}

interface TabLineStyle {
  width?: string;
  transform?: string;
}

export function TabLine(props: TabLineProps) {
  const {selectedTab, selectedKey} = props;
  const {tabProps} = useContext(TabContext);
  const [style, setStyle] = useState<TabLineStyle>({
    width: undefined,
    transform: undefined,
  });

  useLayoutEffect(() => {
    if (selectedTab) {
      if (tabProps.orientation === 'horizontal') {
        setStyle({
          width: `${selectedTab.offsetWidth}px`,
          transform: `translateX(${selectedTab.offsetLeft}px)`,
        });
      } else {
        setStyle({
          width: `0px`,
          transform: `translateY(-${selectedTab.offsetTop}px)`,
        });
      }
    }
  }, [setStyle, selectedTab, selectedKey]);

  return (
    <div
      className="absolute bottom-0 left-0 h-2 bg-primary transition-all"
      role="presentation"
      style={style}
    />
  );
}
