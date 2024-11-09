import {InteractableAction} from './interactable-action';
import {InteractableEvent} from '../interactable-event';
import {InteractableRect} from '../interactable-rect';

export const ROTATION_HANDLE_CLASS = 'rotation-handle';

export class RotateAction implements InteractableAction {
  callbackName = 'onRotate' as const;

  private centerX = 0;
  private centerY = 0;
  private startAngle = 0;

  matches(e: PointerEvent) {
    const target = e.target as HTMLElement;
    return target.classList.contains(ROTATION_HANDLE_CLASS);
  }

  onPointerDown(e: PointerEvent) {
    const currentTarget = e.currentTarget as HTMLElement;
    const rect = currentTarget.getBoundingClientRect();
    // store the center as the element has css `transform-origin: center center`
    this.centerX = rect.left + rect.width / 2;
    this.centerY = rect.top + rect.height / 2;

    const rotateVal =
      currentTarget.style.transform.match(/rotate\((.+?)\)/)?.[1];
    const [rotation = '0'] = rotateVal ? rotateVal.split(',') : [];
    this.startAngle = parseFloat(rotation);

    // get the angle of the element when the drag starts
    this.startAngle = this.getDragAngle(e);
    return {angle: this.startAngle};
  }

  onPointerUp() {
    this.centerX = 0;
    this.centerY = 0;
    this.startAngle = 0;
  }

  execute(e: InteractableEvent): InteractableRect {
    const newRect = {...e.currentRect};

    newRect.angle = this.getDragAngle(e);
    newRect.left += e.deltaX;
    newRect.top += e.deltaY;

    return newRect;
  }

  private getDragAngle(e: {pageX: number; pageY: number}) {
    const center = {
      x: this.centerX || 0,
      y: this.centerY || 0,
    };
    const angle = Math.atan2(center.y - e.pageY, center.x - e.pageX);

    return angle - (this.startAngle || 0);
  }
}
