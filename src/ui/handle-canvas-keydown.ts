import React from 'react';
import {Key} from '../common/ui/keycodes.enum';
import {isCtrlKeyPressed} from '../common/utils/keybinds/is-ctrl-key-pressed';
import {tools} from '../state/utils';

export function handleCanvasKeydown(e: React.KeyboardEvent) {
  switch (e.key) {
    case Key.Z:
      if (isCtrlKeyPressed(e)) {
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey) {
          tools().history.redo();
        } else {
          tools().history.undo();
        }
      }
      break;
    case Key.ARROW_UP:
      e.preventDefault();
      e.stopPropagation();
      tools().objects.move('up');
      break;
    case Key.ARROW_RIGHT:
      e.preventDefault();
      e.stopPropagation();
      tools().objects.move('right');
      break;
    case Key.ARROW_DOWN:
      e.preventDefault();
      e.stopPropagation();
      tools().objects.move('down');
      break;
    case Key.ARROW_LEFT:
      e.preventDefault();
      e.stopPropagation();
      tools().objects.move('left');
      break;
    case Key.DELETE:
      e.preventDefault();
      e.stopPropagation();
      tools().objects.delete();
      break;
    case Key.Y:
      if (isCtrlKeyPressed(e)) {
        e.preventDefault();
        e.stopPropagation();
        tools().history.redo();
      }
      break;
    default:
  }
}
