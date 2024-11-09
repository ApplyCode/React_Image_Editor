import React, {ReactElement, useContext, useRef} from 'react';
import {MenuTriggerProps} from '@react-types/menu';
import {FocusScope} from '@react-aria/focus';
import {AnimatePresence} from 'framer-motion';
import {useMenuTriggerState} from '@react-stately/menu';
import {useMenuTrigger} from '@react-aria/menu';
import {DismissButton, useOverlayPosition} from '@react-aria/overlays';
import {useIsMobileDevice} from '../../utils/hooks/is-mobile-device';
import {Popover} from '../overlays/popover/popover';
import {MenuContext} from './menu-context';
import {OverlayPositionContext} from '../overlays/overlay-position-context';
import {Tray} from '../overlays/tray';

interface Props extends MenuTriggerProps {
  children: ReactElement[];
}
export function MenuTrigger(props: Props) {
  const {children, closeOnSelect, shouldFlip} = props;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contextValue = useContext(OverlayPositionContext);
  const menuRef = useRef<HTMLUListElement>(null);

  const [menuTrigger, menu] = React.Children.toArray(children);
  const state = useMenuTriggerState(props);
  const {menuTriggerProps, menuProps} = useMenuTrigger({}, state, triggerRef);

  const isMobile = useIsMobileDevice();
  const {overlayProps: positionProps, placement} = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    scrollRef: menuRef,
    boundaryElement: contextValue?.boundary?.current!,
    placement: contextValue?.placement ?? 'bottom',
    shouldFlip: shouldFlip ?? contextValue?.shouldFlip ?? true,
    offset: 5,
    isOpen: state.isOpen && !isMobile,
    onClose: state.close,
  });
  // TODO: https://github.com/adobe/react-spectrum/issues/2874
  if (contextValue?.maxHeight) {
    positionProps.style!.maxHeight = contextValue.maxHeight;
  }

  const menuContext = {
    ...menuProps,
    ref: menuRef,
    onClose: state.close,
    closeOnSelect,
    autoFocus: state.focusStrategy || true,
  };

  const contents = (
    <FocusScope restoreFocus contain={isMobile}>
      <DismissButton onDismiss={state.close} />
      {menu}
      <DismissButton onDismiss={state.close} />
    </FocusScope>
  );

  // On small screen devices, the menu is rendered in a tray, otherwise a popover.
  let overlay: ReactElement;
  if (isMobile) {
    overlay = (
      <Tray isOpen={state.isOpen} onClose={state.close}>
        {contents}
      </Tray>
    );
  } else {
    overlay = (
      <Popover
        isOpen={state.isOpen}
        style={positionProps.style}
        ref={overlayRef}
        placement={placement}
        hideArrow
        onClose={state.close}
        shouldCloseOnBlur
      >
        {contents}
      </Popover>
    );
  }

  return (
    <>
      {React.cloneElement(menuTrigger as ReactElement, {
        ...menuTriggerProps,
        ref: triggerRef,
        isPressed: state.isOpen,
      })}
      <AnimatePresence>
        {state.isOpen && (
          <MenuContext.Provider value={menuContext}>
            {overlay}
          </MenuContext.Provider>
        )}
      </AnimatePresence>
    </>
  );
}
