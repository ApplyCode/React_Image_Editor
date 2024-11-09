import {InteractableAction} from './interactable-action';
import {InteractableEvent} from '../interactable-event';
import {InteractableRect} from '../interactable-rect';

export class MoveAction implements InteractableAction {
  callbackName = 'onMove' as const;

  // this should persist between pointerup/down
  lockMovement = false;

  matches(e: PointerEvent) {
    return !!e.target && !!e.currentTarget && e.target === e.currentTarget;
  }

  execute(e: InteractableEvent): InteractableRect {
    if (this.lockMovement) {
      return e.currentRect;
    }
    const newRect = e.currentRect;
    newRect.left += e.deltaX;
    newRect.top += e.deltaY;
    return newRect;
  }
}
