import React, {
  ReactElement,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {ValueBase} from '@react-types/shared';
import {AnimatePresence} from 'framer-motion';
import {useSelectState} from '@react-stately/select';
import {AriaSelectProps} from '@react-types/select';
import {FocusScope} from '@react-aria/focus';
import {HiddenSelect, useSelect} from '@react-aria/select';
import {DismissButton, useOverlayPosition} from '@react-aria/overlays';
import {useButton} from '@react-aria/button';
import {useLayoutEffect, useResizeObserver} from '@react-aria/utils';
import {OverlayPositionContext} from '../../overlays/overlay-position-context';
import {inputFieldStyle} from '../input-field/input-field-style';
import {CommonInputFieldProps} from '../input-field/input-field-props';
import {Adornment} from '../input-field/adornment';
import {ListBox} from '../listbox/listbox';
import {Popover} from '../../overlays/popover/popover';
import {useIsMobileDevice} from '../../../utils/hooks/is-mobile-device';
import {Tray} from '../../overlays/tray';
import {KeyboardArrowDownIcon} from '../../../icons/material/KeyboardArrowDown';
import {Placement} from '@react-types/overlays';

interface PickerProps<T>
  extends AriaSelectProps<T>,
    ValueBase<any>,
    CommonInputFieldProps {
  placement?: Placement;
}
export function Picker<T extends object>(props: PickerProps<T>) {
  const {label, name, value, onChange, isDisabled, autoComplete, shouldFlip} = {
    ...props,
  };
  const style = inputFieldStyle({...props, endAdornment: true});
  const state = useSelectState<T>({
    ...props,
    onSelectionChange: onChange,
    selectedKey: value,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const contextValue = useContext(OverlayPositionContext);

  const {
    labelProps,
    triggerProps,
    valueProps,
    menuProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    descriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    errorMessageProps,
  } = useSelect(props, state, triggerRef);

  const isMobile = useIsMobileDevice();
  const {overlayProps: positionProps, placement} = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    scrollRef: listboxRef,
    placement: props.placement ?? contextValue?.placement ?? 'bottom',
    boundaryElement: contextValue?.boundary?.current!,
    shouldFlip: shouldFlip ?? contextValue?.shouldFlip ?? true,
    offset: 10,
    isOpen: state.isOpen,
    onClose: state.close,
  });
  // TODO: https://github.com/adobe/react-spectrum/issues/2874
  if (contextValue?.maxHeight) {
    positionProps.style!.maxHeight = contextValue.maxHeight;
  }

  const {buttonProps} = useButton(triggerProps, triggerRef);

  const listbox = (
    <FocusScope restoreFocus contain={isMobile}>
      <DismissButton onDismiss={() => state.close()} />
      <ListBox
        {...menuProps}
        ref={listboxRef}
        state={state}
        disallowEmptySelection
        autoFocus={state.focusStrategy || true}
        shouldSelectOnPressUp
      />
      <DismissButton onDismiss={() => state.close()} />
    </FocusScope>
  );

  const [buttonWidth, setButtonWidth] = useState<number | null>(null);

  const onResize = useCallback(() => {
    if (!isMobile && triggerRef.current) {
      const width = triggerRef.current.offsetWidth;
      setButtonWidth(width);
    }
  }, [setButtonWidth, isMobile]);

  useResizeObserver({
    ref: triggerRef,
    onResize,
  });

  useLayoutEffect(onResize, [state.selectedKey, onResize]);

  let overlay: ReactElement;
  if (isMobile) {
    overlay = (
      <Tray isOpen={state.isOpen} onClose={state.close}>
        {listbox}
      </Tray>
    );
  } else {
    overlay = (
      <Popover
        isOpen={state.isOpen}
        ref={overlayRef}
        placement={placement}
        hideArrow
        shouldCloseOnBlur
        onClose={state.close}
        style={{
          ...positionProps.style,
          width: `${buttonWidth}px`,
        }}
      >
        {listbox}
      </Popover>
    );
  }

  return (
    <div className={style.wrapper}>
      <div {...labelProps} className={style.label}>
        {label}
      </div>
      <HiddenSelect
        state={state}
        autoComplete={autoComplete}
        isDisabled={isDisabled}
        triggerRef={triggerRef}
        label={label}
        name={name}
      />
      <button
        type="button"
        className={style.input}
        disabled={isDisabled}
        {...buttonProps}
        ref={triggerRef}
      >
        <span {...valueProps}>{state.selectedItem?.rendered}</span>
        <Adornment direction="end">
          <KeyboardArrowDownIcon className="text-muted" />
        </Adornment>
      </button>
      <AnimatePresence>{state.isOpen && overlay}</AnimatePresence>
    </div>
  );
}
