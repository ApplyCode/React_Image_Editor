import React, {HTMLAttributes, ReactElement, RefObject} from 'react';
import {AnimatePresence} from 'framer-motion';
import {AriaButtonProps} from '@react-types/button';
import {OverlayTriggerState} from '@react-stately/overlays';
import {mergeProps} from '@react-aria/utils';
import {DialogContext, DialogContextValue} from '../dialog-context';
import {DialogType} from '../dialog/dialog';

export interface DialogTriggerBaseProps {
  type: DialogType;
  state: OverlayTriggerState;
  isDismissable?: boolean;
  overlayProps?: HTMLAttributes<HTMLElement>;
  triggerProps: AriaButtonProps & {ref: RefObject<HTMLElement>};
  overlay: ReactElement;
  trigger?: ReactElement;
  disableInitialTransition?: boolean;
}
export function DialogTriggerBase({
  state,
  triggerProps,
  type,
  isDismissable,
  overlay,
  overlayProps = {},
  trigger,
  disableInitialTransition,
}: DialogTriggerBaseProps) {
  const context: DialogContextValue = {
    type,
    onClose: state.close,
    isDismissable,
    disableInitialTransition,
    ...overlayProps,
  };

  return (
    <>
      {trigger &&
        React.cloneElement(
          trigger,
          mergeProps(
            {
              onClick: () => state.open(),
              // TODO: https://github.com/vitejs/vite/issues/5646
              key: trigger.key || trigger.props.id,
            },
            triggerProps
          )
        )}
      <AnimatePresence>
        {state.isOpen && (
          <DialogContext.Provider value={context}>
            {overlay}
          </DialogContext.Provider>
        )}
      </AnimatePresence>
    </>
  );
}
