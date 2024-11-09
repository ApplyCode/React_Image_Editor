import React, {useEffect, useRef} from 'react';
import {useStore} from '../../../state/store';
import {CornerHandle} from '../corner-handle';
import {Interactable} from '../../../common/ui/interactions/interactable';
import {MoveAction} from '../../../common/ui/interactions/actions/move-action';
import {ResizeAction} from '../../../common/ui/interactions/actions/resize-action';
import {RotateAction} from '../../../common/ui/interactions/actions/rotate-action';
import {ObjectControlConfig, PixieConfig} from '../../../config/default-config';
import {FloatingObjectControls} from '../floating-object-controls';
import {
  enableTextEditing,
  moveActiveObj,
  resizeActiveObj,
  rotateActiveObj,
  syncBoxPositionWithActiveObj,
} from './object-box-actions';
import {RotationControl} from './ratation-control';
import {ObjectModifiedEvent} from '../../object-modified-event';
import {fabricCanvas, state, tools} from '../../../state/utils';

export function ObjectBox() {
  const boxRef = useRef<HTMLDivElement>(null!);
  const interactableRef = useRef<Interactable>(null!);
  const floatingControlsRef = useRef<HTMLDivElement>(null!);
  const objectControlConfig = useStore(s => s.config.objectControls);
  const activeObjId = useStore(s => s.objects.active.id);
  const isEditingText = useStore(s => s.objects.isEditingText);
  const zoom = useStore(s => s.zoom);
  const objTypeConfig = getObjTypeConfig();

  useEffect(() => {
    // wait until fabric is initialized
    if (!fabricCanvas()) return;
    state().editor.on('object:modified', (e: ObjectModifiedEvent) => {
      if (e.sizeOrPositionChanged) {
        syncBoxPositionWithActiveObj(boxRef, floatingControlsRef);
      }
    });
    interactableRef.current = new Interactable(boxRef.current, {
      minWidth: 50,
      minHeight: 50,
      maintainInitialAspectRatio: true,
      actions: [new MoveAction(), new ResizeAction(), new RotateAction()],
      listeners: {
        onPointerUp: () => {
          state().objects.setActiveIsMoving(false);
        },
        onDoubleTap: () => {
          enableTextEditing();
        },
        onRotate: e => {
          state().objects.setActiveIsMoving(true);
          rotateActiveObj(e);
        },
        onMove: e => {
          state().objects.setActiveIsMoving(true);
          moveActiveObj(e);
        },
        onResize: e => {
          state().objects.setActiveIsMoving(true);
          resizeActiveObj(e);
        },
      },
    });
    return () => {
      interactableRef.current.destroy();
    };
  }, []);

  // update interactable config when pixie config changes
  useEffect(() => {
    onObjectControlConfigChange(interactableRef.current, objTypeConfig);
  }, [objectControlConfig]);

  // reposition on when obj is selected/deselected, or zoom or after user is done with editing text
  useEffect(() => {
    syncBoxPositionWithActiveObj(boxRef, floatingControlsRef);
  }, [activeObjId, zoom, isEditingText]);

  const display = activeObjId && !isEditingText ? 'block' : 'hidden';

  return (
    <div className={display}>
      <div
        ref={boxRef}
        className="absolute z-obj-box border-2 border-white shadow-md cursor-move"
      >
        {!objTypeConfig.hideTopLeft && <CornerHandle position="top-left" />}
        {!objTypeConfig.hideTopRight && <CornerHandle position="top-right" />}
        {!objTypeConfig.hideBottomLeft && (
          <CornerHandle position="bottom-left" />
        )}
        {!objTypeConfig.hideBottomRight && (
          <CornerHandle position="bottom-right" />
        )}
        {!objTypeConfig.hideRotatingPoint && <RotationControl />}
      </div>
      <FloatingObjectControls ref={floatingControlsRef} />
    </div>
  );
}

function onObjectControlConfigChange(
  interactable: Interactable,
  objTypeConfig: ObjectControlConfig
): void {
  // maybe lock movement based on user config
  const moveAction = interactable.config.actions.find(
    a => a instanceof MoveAction
  ) as MoveAction;
  moveAction.lockMovement = !!objTypeConfig.lockMovement;

  // maybe maintain aspect ratio
  interactable.setConfig({
    maintainInitialAspectRatio: !objTypeConfig.unlockAspectRatio,
  });
}

function getObjTypeConfig(): ObjectControlConfig {
  const obj = tools().objects.getActive();
  if (!obj || !obj.name) return {};
  const userConfig = state().config.objectControls || {};
  const objName = obj.name as keyof PixieConfig['objectControls'];
  return {
    ...userConfig.global,
    ...(userConfig[objName] as ObjectControlConfig),
  };
}
