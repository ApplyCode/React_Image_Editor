import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useContext,
  useRef,
} from 'react';
import {m} from 'framer-motion';
import {useModal, useOverlay, usePreventScroll} from '@react-aria/overlays';
import {mergeProps} from '@react-aria/utils';
import {Underlay} from './underlay';
import {DialogContext} from '../dialog-context';
import {Overlay} from '../overlay';

export type ModalType = 'modal' | 'tray' | 'fullscreen' | 'fullscreenTakeover';

export interface ModalProps {
  children: ReactNode;
  isOpen?: boolean;
  container?: Element;
  onClose?: () => void;
  type: ModalType;
  isDismissable?: boolean;
}

export function Modal(props: ModalProps) {
  const {children, onClose, type, isOpen, isDismissable, ...otherProps} = props;
  const ref = useRef<HTMLDivElement>(null);
  const {disableInitialTransition} = useContext(DialogContext);

  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const {overlayProps, underlayProps} = useOverlay(props, ref);

  return (
    <Overlay
      type="modal"
      {...otherProps}
      className="absolute inset-0 flex items-center justify-center"
    >
      <Underlay
        disableInitialTransition={disableInitialTransition}
        key="modal-underlay"
        {...underlayProps}
      />
      <ModalWrapper
        key="modal-wrapper"
        onClose={onClose}
        isOpen={isOpen}
        type={type}
        ref={ref}
        overlayProps={overlayProps}
      >
        {children}
      </ModalWrapper>
    </Overlay>
  );
}

interface ModalWrapperProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  type: ModalType;
  overlayProps: HTMLAttributes<HTMLElement>;
}
const ModalWrapper = forwardRef<HTMLDivElement, ModalWrapperProps>(
  (props, ref) => {
    const {children, isOpen, type, overlayProps, ...otherProps} = props;
    const {disableInitialTransition} = useContext(DialogContext);

    usePreventScroll();
    // Hide content outside the modal from screen readers.
    const {modalProps} = useModal();

    const animate = {opacity: 1, scale: 1};

    return (
      <m.div
        className="z-20"
        initial={disableInitialTransition ? animate : {opacity: 0, scale: 0.7}}
        animate={animate}
        exit={{opacity: 0, scale: 1}}
      >
        <div {...mergeProps(otherProps, overlayProps, modalProps)} ref={ref}>
          {children}
        </div>
      </m.div>
    );
  }
);
