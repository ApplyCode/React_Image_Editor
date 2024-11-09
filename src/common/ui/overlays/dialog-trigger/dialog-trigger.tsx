import React, {ReactElement, RefObject} from 'react';
import {Placement} from '@react-types/overlays';
import {OverlayTriggerProps} from '@react-aria/overlays';
import {
  OverlayTriggerState,
  useOverlayTriggerState,
} from '@react-stately/overlays';
import {PopoverTrigger} from '../popover/popover-trigger';
import {ModalType} from '../modal/modal';
import {ModalTrigger} from '../modal/modal-trigger';
import {useIsMobileMediaQuery} from '../../../utils/hooks/is-mobile-media-query';

type Child = ((state: OverlayTriggerState) => ReactElement) | ReactElement;
export interface DialogTriggerProps extends Omit<OverlayTriggerProps, 'type'> {
  children: [Child, Child] | Child;
  type: 'popover' | ModalType;
  mobileType?: ModalType;
  hideArrow?: boolean;
  placement?: Placement;
  targetRef?: RefObject<HTMLElement>;
  isDismissable?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  disableInitialTransition?: boolean;
}
export function DialogTrigger(props: DialogTriggerProps) {
  let {
    type = 'modal',
    isDismissable = true,
    // eslint-disable-next-line prefer-const
    mobileType = type === 'popover' ? 'modal' : type,
  } = props;
  const {children, hideArrow, targetRef, disableInitialTransition, onClose} =
    props;

  // On small devices, show a modal or tray instead of a popover.
  const isMobile = useIsMobileMediaQuery();
  if (isMobile) {
    // handle cases where desktop popovers need a close button for the mobile modal view
    if (type !== 'modal' && mobileType === 'modal') {
      isDismissable = true;
    }

    type = mobileType;
  }

  const state = useOverlayTriggerState({
    ...props,
    onOpenChange: isOpen => {
      if (!isOpen && onClose) {
        onClose();
      }
    },
  });
  const {trigger, content} = unwrapChildren(children, state);

  if (type === 'popover') {
    return (
      <PopoverTrigger
        state={state}
        targetRef={targetRef}
        trigger={trigger}
        placement={props.placement ?? 'bottom'}
        hideArrow={hideArrow}
      >
        {content}
      </PopoverTrigger>
    );
  }
  return (
    <ModalTrigger
      state={state}
      trigger={trigger}
      type={type}
      isDismissable={isDismissable}
      disableInitialTransition={disableInitialTransition}
    >
      {content}
    </ModalTrigger>
  );
}

function unwrapChildren(
  children: DialogTriggerProps['children'],
  state: OverlayTriggerState
): {trigger?: ReactElement; content: ReactElement} {
  if (Array.isArray(children)) {
    const [trigger, content] = children;
    return {
      trigger: typeof trigger === 'function' ? trigger(state) : trigger,
      content: typeof content === 'function' ? content(state) : content,
    };
  }
  return {
    content: children as ReactElement,
  };
}
