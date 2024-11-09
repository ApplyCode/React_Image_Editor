import React, {useContext} from 'react';
import clsx from 'clsx';
import {ModalProviderProps, OverlayContainer} from '@react-aria/overlays';
import {OverlayPositionContext} from './overlay-position-context';

interface Props extends ModalProviderProps {
  type: 'modal' | 'tray' | 'popover';
}

export function Overlay(props: Props) {
  const {children, className, type, ...otherProps} = props;
  const contextValue = useContext(OverlayPositionContext);

  let zIndex: string;
  if (type === 'modal') {
    zIndex = 'z-modal';
  } else if (type === 'popover') {
    zIndex = 'z-popover';
  } else {
    zIndex = 'z-tray';
  }

  return (
    <OverlayContainer
      className={clsx(
        'isolate absolute top-0 left-0',
        type !== 'popover' && 'w-full h-full',
        zIndex,
        className
      )}
      portalContainer={contextValue?.portalContainer?.current!}
      {...otherProps}
    >
      {children}
    </OverlayContainer>
  );
}
