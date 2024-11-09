import {InteractableRect} from './interactable-rect';

export interface InteractableEvent {
  deltaX: number;
  deltaY: number;
  pageX: number;
  pageY: number;
  currentRect: InteractableRect;
  aspectRatio: number | null;
}
