import {PlainRect} from '../../../utils/dom/get-bounding-client-rect';

export function pointerIsOutsideBoundary(
  e: PointerEvent,
  boundary?: PlainRect
): boolean {
  if (!boundary) return false;

  // top
  if (boundary.top >= e.pageY) {
    return true;
  }

  // right
  if (boundary.right <= e.pageX) {
    return true;
  }

  // bottom
  if (boundary.bottom <= e.pageY) {
    return true;
  }

  // left
  if (boundary.left >= e.pageX) {
    return true;
  }

  return false;
}
