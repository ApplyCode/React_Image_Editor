import React, {RefObject} from 'react';
import {Placement} from '@react-types/overlays';

interface IOverlayPositionContext {
  boundary?: RefObject<HTMLElement>;
  portalContainer?: RefObject<HTMLElement>;
  placement?: Placement;
  shouldFlip?: boolean;
  maxHeight?: string;
}

export const OverlayPositionContext =
  React.createContext<IOverlayPositionContext | null>(null);
