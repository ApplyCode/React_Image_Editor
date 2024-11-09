import React, {forwardRef, RefObject} from 'react';
import {AriaListBoxOptions, useListBox} from '@react-aria/listbox';
import {ListState} from '@react-stately/list';
import {ListboxOption} from './listbox-option';
import {listboxWrapperStyle} from './listbox-style';

interface ListBoxProps extends AriaListBoxOptions<unknown> {
  state: ListState<unknown>;
  className?: string;
  style?: React.CSSProperties;
}
export const ListBox = forwardRef<HTMLUListElement, ListBoxProps>(
  ({className, style, ...props}, inRef) => {
    const ref = inRef as RefObject<HTMLUListElement>;
    const {state} = props;
    const {listBoxProps} = useListBox(props, state, ref);
    const mergedClassname = listboxWrapperStyle(className);
    return (
      <ul className={mergedClassname} style={style} {...listBoxProps} ref={ref}>
        {[...state.collection].map(item => (
          <ListboxOption key={item.key} item={item} state={state} />
        ))}
      </ul>
    );
  }
);
