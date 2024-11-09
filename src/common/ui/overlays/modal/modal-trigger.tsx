import React, {ReactElement, useRef} from 'react';
import {OverlayTriggerState} from '@react-stately/overlays';
import {DialogTriggerBase} from '../dialog-trigger/dialog-trigger-base';
import {Modal, ModalType} from './modal';
import {Tray} from '../tray';

interface ModalTriggerProps {
  state: OverlayTriggerState;
  trigger?: ReactElement;
  children: ReactElement;
  type: ModalType;
  /** Whether a modal type Dialog should be dismissable. */
  isDismissable: boolean;
  disableInitialTransition?: boolean;
}
export function ModalTrigger({
  state,
  trigger,
  children,
  type,
  isDismissable,
  disableInitialTransition,
}: ModalTriggerProps) {
  const triggerRef = useRef<HTMLElement>(null);

  const renderOverlay = () => {
    switch (type) {
      case 'tray':
        return (
          <Tray isOpen={state.isOpen} onClose={state.close}>
            {children}
          </Tray>
        );
      default:
        return (
          <Modal
            isOpen={state.isOpen}
            isDismissable={isDismissable}
            onClose={state.close}
            type={type}
          >
            {children}
          </Modal>
        );
    }
  };

  return (
    <DialogTriggerBase
      type={type}
      state={state}
      disableInitialTransition={disableInitialTransition}
      triggerProps={{ref: triggerRef}}
      isDismissable={isDismissable}
      overlay={renderOverlay()}
      trigger={trigger}
    />
  );
}
