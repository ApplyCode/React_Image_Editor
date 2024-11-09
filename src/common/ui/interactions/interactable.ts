import {InteractableCallback, InteractableConfig} from './interactable-config';
import {InteractableRect} from './interactable-rect';
import {InteractableAction} from './actions/interactable-action';

export class Interactable {
  private doubleTapTimer: NodeJS.Timeout | null = null;
  private readonly boundOnPointerDown: (e: PointerEvent) => void;
  private readonly boundOnPointerUp: (e: PointerEvent) => void;

  constructor(private el: HTMLElement, public config: InteractableConfig) {
    this.boundOnPointerDown = this.onPointerDown.bind(this);
    this.boundOnPointerUp = this.onPointerUp.bind(this);
    el.addEventListener('pointerdown', this.boundOnPointerDown);
    el.addEventListener('pointerup', this.boundOnPointerUp);
  }

  currentRect: InteractableRect = {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    angle: 0,
  };
  private currentAction?: InteractableAction | null;
  private initialAspectRatio = 0;
  private lastPosition: {pageX: number; pageY: number} = {pageX: 0, pageY: 0};

  get aspectRatio(): number | null {
    if (this.config.maintainInitialAspectRatio) {
      return this.initialAspectRatio;
    }
    if (this.config.aspectRatio) {
      return this.config.aspectRatio;
    }
    return null;
  }

  setConfig(newConfig: Partial<InteractableConfig>) {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }

  destroy() {
    this.el.removeEventListener('pointerdown', this.boundOnPointerDown);
    this.el.removeEventListener('pointerup', this.boundOnPointerUp);
  }

  private onPointerDown(e: PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.lastPosition = {pageX: e.pageX, pageY: e.pageY};
    this.el.style.touchAction = 'none';
    this.el.style.userSelect = 'none';
    this.syncCurrentRectWithEl(this.el);

    this.currentAction = this.config.actions.find(a => a.matches(e));
    if (this.currentAction) {
      this.currentRect = {
        ...this.currentRect,
        ...this.currentAction.onPointerDown?.(e),
      };
    }

    this.config.listeners.onPointerDown?.({rect: this.currentRect});

    this.el.onpointermove = this.onPointerMove.bind(this);
    this.el.setPointerCapture(e.pointerId);
  }

  private onPointerMove(e: PointerEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (this.currentAction) {
      this.executeAction(this.currentAction, e);
    }
    this.lastPosition = {pageX: e.pageX, pageY: e.pageY};
  }

  executeAction(action: InteractableAction, e: PointerEvent, extra?: any) {
    const prevRect = {...this.currentRect};
    this.currentRect = action.execute(
      {
        deltaX: e.pageX - this.lastPosition.pageX,
        deltaY: e.pageY - this.lastPosition.pageY,
        pageX: e.pageX,
        pageY: e.pageY,
        aspectRatio: this.aspectRatio,
        currentRect: this.currentRect,
      },
      extra
    );

    if (this.config.modifiers) {
      this.currentRect = this.config.modifiers.reduce(
        (rect, modifier) =>
          modifier({currentRect: this.currentRect, prevRect}, this.config),
        this.currentRect
      );
    }

    const callback = this.config.listeners[
      action.callbackName
    ] as InteractableCallback;
    const payload = {rect: {...this.currentRect}, prevRect};
    callback?.(payload);
  }

  private syncCurrentRectWithEl(el: HTMLElement) {
    const translateVal = el.style.transform.match(/translate\((.+?)\)/)?.[1];
    const [left = '0', top = '0'] = (translateVal || '').split(',');

    this.currentRect = {
      // use clientHeight to rotation transform is ignored, it does not include margin
      width: el.offsetWidth,
      height: el.offsetHeight,
      left: parseInt(left, 10),
      top: parseInt(top, 10),
      angle: 0,
    };
    this.initialAspectRatio = this.currentRect.width / this.currentRect.height;
  }

  private onPointerUp(e: PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    const currentTarget = e.currentTarget as HTMLElement;
    this.currentAction = null;
    currentTarget.onpointermove = null;
    currentTarget.releasePointerCapture(e.pointerId);
    this.config.actions.forEach(a => a.onPointerUp?.(e));
    this.config.listeners.onPointerUp?.({rect: this.currentRect});
    this.handleDoubleTap(e);
  }

  private handleDoubleTap(e: PointerEvent) {
    if (!this.doubleTapTimer) {
      this.doubleTapTimer = setTimeout(() => {
        this.doubleTapTimer = null;
      }, 300);
    } else {
      clearTimeout(this.doubleTapTimer);
      this.doubleTapTimer = null;
      this.config.listeners.onDoubleTap?.(e);
    }
  }
}
