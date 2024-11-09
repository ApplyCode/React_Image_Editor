import {InteractableEvent} from '../interactable-event';
import {InteractableAction} from './interactable-action';
import {InteractableRect} from '../interactable-rect';
import {calcNewSizeFromAspectRatio} from '../utils/calc-new-size-from-aspect-ratio';

export type CornerHandlePosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | null;

export class ResizeAction implements InteractableAction {
  callbackName = 'onResize' as const;
  private resizeDir: CornerHandlePosition = null;

  matches(e: PointerEvent) {
    const target = e.target as HTMLElement;
    if (target.dataset.position) {
      this.resizeDir = target.dataset.position as CornerHandlePosition;
      return true;
    }
    return false;
  }

  execute(e: InteractableEvent, rect: InteractableRect) {
    if (rect) {
      return this.resizeUsingRect(e, rect);
    }
    return this.resizeUsingEvent(e);
  }

  onPointerUp() {
    this.resizeDir = null;
  }

  private resizeUsingEvent(e: InteractableEvent): InteractableRect {
    const prevRect = {...e.currentRect};
    const newRect = {...e.currentRect};
    const ratio = e.aspectRatio;

    if (this.resizeDir === 'top-right') {
      newRect.width = Math.floor(newRect.width + e.deltaX);
      if (ratio) {
        newRect.height = Math.floor(newRect.width / ratio);
      } else {
        newRect.height = Math.floor(newRect.height - e.deltaY);
      }
      newRect.top = Math.floor(
        newRect.top + (prevRect.height - newRect.height)
      );
    } else if (this.resizeDir === 'bottom-right') {
      newRect.width = Math.floor(newRect.width + e.deltaX);
      if (ratio) {
        newRect.height = Math.floor(newRect.width / ratio);
      } else {
        newRect.height = Math.floor(newRect.height + e.deltaY);
      }
    } else if (this.resizeDir === 'top-left') {
      newRect.width = Math.floor(newRect.width - e.deltaX);
      if (ratio) {
        newRect.height = Math.floor(newRect.width / ratio);
      } else {
        newRect.height = Math.floor(newRect.height - e.deltaY);
      }
      newRect.left = Math.floor(
        newRect.left + (prevRect.width - newRect.width)
      );
      newRect.top = Math.floor(
        newRect.top + (prevRect.height - newRect.height)
      );
    } else if (this.resizeDir === 'bottom-left') {
      newRect.width = Math.floor(newRect.width - e.deltaX);
      if (ratio) {
        newRect.height = Math.floor(newRect.width / ratio);
      } else {
        newRect.height = Math.floor(newRect.height + e.deltaY);
      }
      newRect.left = Math.floor(
        newRect.left + (prevRect.width - newRect.width)
      );
    }
    return newRect;
  }

  resizeUsingRect(
    e: InteractableEvent,
    newRect: InteractableRect
  ): InteractableRect {
    const currentRect = {
      ...e.currentRect,
      ...newRect,
    };
    if (e.aspectRatio) {
      const size = calcNewSizeFromAspectRatio(
        e.aspectRatio,
        currentRect.width,
        currentRect.height
      );
      currentRect.width = size.width;
      currentRect.height = size.height;
    }
    return currentRect;
  }
}
