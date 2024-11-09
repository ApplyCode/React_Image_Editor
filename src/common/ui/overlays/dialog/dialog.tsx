import React, {ReactElement, ReactNode, useContext, useRef} from 'react';
import {AriaLabelingProps, DOMProps} from '@react-types/shared';
import clsx from 'clsx';
import {useDialog} from '@react-aria/dialog';
import {mergeProps} from '@react-aria/utils';
import {FocusScope} from '@react-aria/focus';
import {DismissButton} from '@react-aria/overlays';
import {DialogContext} from '../dialog-context';
import {IconButton} from '../../buttons/icon-button';
import {DialogHeader} from './dialog-header';
import {CloseIcon} from '../../../icons/material/Close';

export type DialogType =
  | 'modal'
  | 'popover'
  | 'tray'
  | 'fullscreen'
  | 'fullscreenTakeover';

export interface AriaDialogProps extends DOMProps, AriaLabelingProps {
  role?: 'dialog' | 'alertdialog';
}

export interface DialogProps extends AriaDialogProps {
  children: ReactNode;
  size?: 'S' | 'M' | 'L';
  className?: string;
}

export function Dialog(props: DialogProps) {
  const {type = 'modal', ...contextProps} = useContext(DialogContext);
  const ref = useRef<HTMLDivElement>(null);
  const {dialogProps, titleProps} = useDialog(
    mergeProps(contextProps, props),
    ref
  );

  const {children, className} = props;

  // If rendered in a popover or tray there won't be a visible dismiss button,
  // so we render a hidden one for screen readers.
  let dismissButton: ReactElement | null = null;
  if (type === 'popover' || type === 'tray') {
    dismissButton = <DismissButton onDismiss={contextProps.onClose} />;
  }

  let hasHeader = false;
  const dialogChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === DialogHeader) {
      hasHeader = true;
      return React.cloneElement(child, {...child.props, titleProps});
    }
    return child;
  });

  // use max-h-inherit so can add scroll to whole popover
  const mergedClassName = clsx(
    'bg-paper rounded shadow-lg max-h-inherit max-w-full focus:outline-none',
    className
  );

  return (
    <FocusScope contain restoreFocus>
      <section {...dialogProps} className={mergedClassName} ref={ref}>
        {contextProps.isDismissable && hasHeader && (
          <IconButton aria-label="Dismiss" onPress={contextProps.onClose}>
            <CloseIcon />
          </IconButton>
        )}
        {dialogChildren}
        {dismissButton}
      </section>
    </FocusScope>
  );
}
