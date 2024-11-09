import {IEvent, Object as IObject} from 'fabric/fabric-impl';
import {getToolForObj, setActiveTool} from '../ui/navbar/set-active-tool';
import {state, tools} from '../state/utils';

interface SelectionEvent extends IEvent {
  deselected?: IObject[];
}

export function bindToFabricSelectionEvents() {
  state().fabric.on('selection:created', e => {
    if (!shouldPreventObjDeselect(e)) {
      selectNewObj(e.target);
    }
  });
  state().fabric.on('selection:updated', e => {
    if (!shouldPreventObjDeselect(e)) {
      selectNewObj(e.target);
    }
  });
  state().fabric.on('selection:cleared', () => {
    selectNewObj();
  });
}

function shouldPreventObjDeselect(e: SelectionEvent): boolean {
  const [toolName] = getToolForObj(e.target);
  const objIsHandledByActiveTool = toolName === state().activeTool;
  if (state().dirty && (!e.target || !objIsHandledByActiveTool)) {
    if (e.deselected) {
      tools().objects.select(e.deselected[0]);
    }
    return true;
  }
  return false;
}

function selectNewObj(obj?: IObject) {
  if (obj?.data.id === state().objects.active.id) {
    return;
  }
  state().objects.setActive(obj ?? null);
  setActiveTool();
}
