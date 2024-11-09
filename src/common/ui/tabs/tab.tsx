import React, {useContext, useRef} from 'react';
import clsx from 'clsx';
import {DOMProps, Node} from '@react-types/shared';
import {SingleSelectListState} from '@react-stately/list';
import {useTab} from '@react-aria/tabs';
import {useHover} from '@react-aria/interactions';
import {mergeProps} from '@react-aria/utils';
import {FocusRing} from '@react-aria/focus';
import {TabContext} from './tabs-context';

interface TabProps<T> extends DOMProps {
  item: Node<T>;
  state: SingleSelectListState<T>;
  className?: string;
}

export function Tab<T>(props: TabProps<T>) {
  const tabContext = useContext(TabContext);
  const {item, state, className} = props;
  const {key, rendered} = item;
  const isDisabled = state.disabledKeys.has(key);
  const isSelected = state.selectedKey === key;

  const ref = useRef<HTMLDivElement>(null);
  const {tabProps} = useTab({key}, state, ref);
  const {hoverProps, isHovered} = useHover({...props, isDisabled});

  const size = tabContext.tabProps.size;
  const mergedClassname = clsx(
    'tracking-wide overflow-hidden capitalize flex-shrink-0 flex items-center outline-none transition-colors',
    textColor({isDisabled, isHovered, isSelected}),
    className,
    {
      'px-16 h-48': !size || size === 'md',
      'px-12 h-32': size === 'sm',
      'cursor-pointer': !isDisabled,
      'border-primary':
        tabContext.tabProps.orientation === 'vertical' && isSelected,
      'border-b-2 border-transparent':
        tabContext.tabProps.orientation === 'vertical',
    }
  );
  return (
    <FocusRing focusRingClass="ring-2 ring-inset ring-primary-light rounded">
      <div
        className={mergedClassname}
        {...mergeProps(tabProps, hoverProps)}
        ref={ref}
      >
        {rendered}
      </div>
    </FocusRing>
  );
}

interface TextColorProps {
  isDisabled: boolean;
  isHovered: boolean;
  isSelected: boolean;
}
function textColor({
  isDisabled,
  isHovered,
  isSelected,
}: TextColorProps): string {
  if (isDisabled) {
    return 'text-disabled cursor-default';
  }
  if (isSelected) {
    return 'text-primary';
  }
  if (isHovered) {
    return 'text-main';
  }
  return 'text-muted';
}
