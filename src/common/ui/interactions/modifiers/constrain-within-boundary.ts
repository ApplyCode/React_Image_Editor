import {InteractableRect} from '../interactable-rect';
import {calcNewSizeFromAspectRatio} from '../utils/calc-new-size-from-aspect-ratio';
import type {InteractableConfig} from '../interactable-config';

type Rects = {
  currentRect: InteractableRect;
  prevRect: InteractableRect;
};

export function constrainWithinBoundary(
  {currentRect, prevRect}: Rects,
  {boundaryRect, minWidth, minHeight, aspectRatio}: InteractableConfig
): InteractableRect {
  let cr = {...currentRect};
  const pr = {...prevRect};

  if (boundaryRect) {
    // hit left boundary
    if (cr.left < 0) {
      cr = pr;
    }
    // hit top boundary
    if (cr.top < 0) {
      cr = pr;
    }
    // hit right boundary
    if (cr.left + cr.width > boundaryRect.width) {
      cr = pr;
    }
    // hit bottom boundary
    if (cr.top + cr.height > boundaryRect.height) {
      cr = pr;
    }
  }

  if (minWidth || minHeight) {
    let min: {width: number; height: number};
    if (aspectRatio) {
      min = calcNewSizeFromAspectRatio(aspectRatio, minWidth, minHeight);
    } else {
      min = {width: minWidth, height: minHeight};
    }

    // min width
    if (min.width && cr.width < min.width) {
      cr.left = pr.left;
      cr.width = min.width;
    }

    // min height
    if (min.height && cr.height < min.height) {
      cr.top = pr.top;
      cr.height = min.height;
    }
  }

  return cr;
}
