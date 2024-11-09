import React, {
  ReactElement,
  ReactNode,
  RefObject,
  useContext,
  useRef,
} from 'react';
import {Placement} from '@react-types/overlays';
import {OverlayTriggerState} from '@react-stately/overlays';
import {useOverlayPosition, useOverlayTrigger} from '@react-aria/overlays';
import {Popover} from './popover';
import {DialogTriggerBase} from '../dialog-trigger/dialog-trigger-base';
import {OverlayPositionContext} from '../overlay-position-context';

export interface PopoverTriggerProps {
  state: OverlayTriggerState;
  trigger?: ReactElement;
  targetRef?: RefObject<HTMLElement>;
  children: ReactNode;
  hideArrow?: boolean;
  placement?: Placement;
  containerPadding?: number;
  offset?: number;
  crossOffset?: number;
  shouldFlip?: boolean;
}
export function PopoverTrigger({
  state,
  targetRef,
  trigger,
  hideArrow,
  children,
  ...props
}: PopoverTriggerProps) {
  const contextValue = useContext(OverlayPositionContext);
  const triggerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const {overlayProps: positionProps, placement} = useOverlayPosition({
    boundaryElement: contextValue?.boundary?.current ?? undefined,
    targetRef: targetRef || triggerRef,
    overlayRef,
    placement: props.placement ?? contextValue?.placement ?? 'bottom',
    shouldFlip: props.shouldFlip ?? contextValue?.shouldFlip ?? true,
    containerPadding: props.containerPadding,
    offset: props.offset ?? 10,
    crossOffset: props.crossOffset,
    isOpen: state.isOpen,
  });
  // TODO: https://github.com/adobe/react-spectrum/issues/2874
  if (contextValue?.maxHeight) {
    positionProps.style!.maxHeight = contextValue.maxHeight;
  }

  // Get props for the trigger and overlay. This also handles
  // hiding the overlay when a parent element of the trigger scrolls
  // (which invalidates the popover positioning).
  const {triggerProps, overlayProps} = useOverlayTrigger(
    {type: 'dialog'},
    state,
    triggerRef
  );

  const overlay = (
    <Popover
      style={positionProps.style}
      isOpen={state.isOpen}
      ref={overlayRef}
      onClose={state.close}
      placement={placement}
      hideArrow={hideArrow}
    >
      {children}
    </Popover>
  );

  return (
    <DialogTriggerBase
      type="popover"
      state={state}
      triggerProps={{...triggerProps, ref: triggerRef}}
      overlayProps={overlayProps}
      overlay={overlay}
      trigger={trigger}
    />
  );
}
