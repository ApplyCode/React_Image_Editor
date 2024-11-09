import React from 'react';
import {InteractableRect} from './interactable-rect';
import {InteractableAction} from './actions/interactable-action';
import {PlainRect} from '../../utils/dom/get-bounding-client-rect';

export type InteractableCallback = (e: {
  rect: InteractableRect;
  prevRect?: InteractableRect;
}) => void;

type Modifier = (
  rects: {
    currentRect: InteractableRect;
    prevRect: InteractableRect;
  },
  config: InteractableConfig
) => InteractableRect;

export interface InteractableConfig {
  boundaryRect?: PlainRect;
  aspectRatio?: number | null;
  maintainInitialAspectRatio?: boolean;
  minWidth: number;
  minHeight: number;
  transformEl?: boolean;
  onInteractStart?: (e: InteractableRect) => void;
  onInteractEnd?: (e: InteractableRect) => void;
  listeners: {
    onMove?: InteractableCallback;
    onRotate?: InteractableCallback;
    onResize?: InteractableCallback;
    onPointerDown?: InteractableCallback;
    onPointerUp?: InteractableCallback;
    onDoubleTap?: (e: PointerEvent) => void;
  };
  modifiers?: Modifier[];
  onDoubleTap?: (e: React.PointerEvent<HTMLElement>) => void;
  actions: InteractableAction[];
}
