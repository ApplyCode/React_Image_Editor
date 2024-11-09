import {InteractableEvent} from '../interactable-event';
import {InteractableRect} from '../interactable-rect';
import type {InteractableConfig} from '../interactable-config';

export interface InteractableAction {
  callbackName: keyof InteractableConfig['listeners'];
  matches(e: PointerEvent): boolean;
  execute(e: InteractableEvent, extra?: any): InteractableRect;
  onPointerDown?(e: PointerEvent): Partial<InteractableRect>;
  onPointerUp?(e: PointerEvent): void;
}
