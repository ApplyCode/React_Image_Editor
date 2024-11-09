import React, {HTMLAttributes} from 'react';

export interface DialogContextValue extends HTMLAttributes<HTMLElement> {
  type: 'modal' | 'popover' | 'tray' | 'fullscreen' | 'fullscreenTakeover';
  isDismissable?: boolean;
  onClose: () => void;
  disableInitialTransition?: boolean;
}

export const DialogContext = React.createContext<DialogContextValue>(null!);
