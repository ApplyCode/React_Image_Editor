import React, {CSSProperties, ReactNode, RefObject} from 'react';
import clsx from 'clsx';
import {PlacementAxis} from '@react-types/overlays';
import {m} from 'framer-motion';
import {OverlayProps, useModal, useOverlay} from '@react-aria/overlays';
import {mergeProps} from '@react-aria/utils';
import {popoverStyle} from './popover-style';
import {PopoverAnimation} from './popover-animation';
import {Overlay} from '../overlay';

export interface PopoverProps extends OverlayProps {
  children: ReactNode;
  placement: PlacementAxis;
  style?: CSSProperties;
  hideArrow?: boolean;
  isNonModal?: boolean;
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (props, ref) => {
    const {
      children,
      placement,
      onClose,
      isOpen,
      shouldCloseOnBlur,
      hideArrow,
      isKeyboardDismissDisabled,
      isNonModal,
      isDismissable = true,
      ...otherProps
    } = props;
    return (
      <Overlay type="popover">
        <PopoverWrapper
          {...otherProps}
          ref={ref}
          placement={placement}
          shouldCloseOnBlur={shouldCloseOnBlur}
          isKeyboardDismissDisabled={isKeyboardDismissDisabled}
          hideArrow={hideArrow}
          isNonModal={isNonModal}
          isDismissable={isDismissable}
          isOpen={isOpen}
          onClose={onClose}
        >
          {children}
        </PopoverWrapper>
      </Overlay>
    );
  }
);

const PopoverWrapper = React.forwardRef<HTMLDivElement, PopoverProps>(
  (props, ref) => {
    const {
      children,
      placement = 'bottom',
      isOpen,
      onClose,
      hideArrow,
      shouldCloseOnBlur,
      isKeyboardDismissDisabled,
      isNonModal,
      isDismissable,
      ...otherProps
    } = props;

    // Handle interacting outside the dialog and pressing
    // the Escape key to close the modal.
    const {overlayProps} = useOverlay(
      {...props, isDismissable: isDismissable && isOpen},
      ref as RefObject<HTMLElement>
    );

    // Hide content outside the modal from screen readers.
    const {modalProps} = useModal({
      isDisabled: isNonModal,
    });

    return (
      // @ts-ignore
      <m.div
        ref={ref}
        {...PopoverAnimation}
        {...mergeProps(otherProps, overlayProps, modalProps)}
        className={popoverStyle}
        role="presentation"
      >
        {children}
        {hideArrow ? null : <Arrow popoverPlacement={placement} />}
      </m.div>
    );
  }
);

type ArrowProps = {
  popoverPlacement: PlacementAxis;
};
function Arrow({popoverPlacement}: ArrowProps) {
  const className = clsx(
    'absolute fill-background',
    popoverPlacement === 'top' && '-translate-x-1/2 left-1/2',
    popoverPlacement === 'bottom' && '-translate-x-1/2 left-1/2 rotate-180',
    popoverPlacement === 'left' && '-translate-y-1/2 top-1/2 rotate-90',
    popoverPlacement === 'right' && '-translate-y-1/2 top-1/2 -rotate-90'
  );

  return (
    <svg
      className={className}
      width="16"
      height="8"
      viewBox="0 0 30 10"
      preserveAspectRatio="none"
    >
      <polygon points="0,0 30,0 15,10" />
    </svg>
  );
}
