import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {CornerHandle} from '../../../../objects/ui/corner-handle';
import {useStore} from '../../../../state/store';
import {MaskPart, MaskPosition} from './mask-part';
import {Line} from './cropzone-line';
import {Interactable} from '../../../../common/ui/interactions/interactable';
import {aspectRatioFromStr} from '../../../../common/ui/interactions/utils/calc-new-size-from-aspect-ratio';
import {ResizeAction} from '../../../../common/ui/interactions/actions/resize-action';
import {MoveAction} from '../../../../common/ui/interactions/actions/move-action';
import {constrainWithinBoundary} from '../../../../common/ui/interactions/modifiers/constrain-within-boundary';
import {CropzoneRefs} from './cropzone-refs';
import {tools} from '../../../../state/utils';

export function Cropzone() {
  const refs = useRef<CropzoneRefs>({} as CropzoneRefs);
  const [isMoving, setIsMoving] = useState(true);
  const boundaryRect = useStore(s => s.canvasSize);
  const controlConfig = useStore(s => s.config.tools?.crop?.cropzone);
  const defaultRatio =
    useStore(s => s.config.tools?.crop?.defaultRatio) || null;

  useEffect(() => {
    if (tools().crop) {
      tools().crop.zone = new Interactable(refs.current.innerZone!, {
        actions: [new MoveAction(), new ResizeAction()],
        modifiers: [constrainWithinBoundary],
        listeners: {
          onPointerDown: () => {
            setIsMoving(true);
          },
          onMove: e => {
            tools().crop.drawZone(e.rect);
          },
          onResize: e => {
            tools().crop.drawZone(e.rect);
          },
          onPointerUp: () => {
            setIsMoving(false);
          },
        },
        minHeight: 50,
        minWidth: 50,
        boundaryRect,
        aspectRatio: aspectRatioFromStr(defaultRatio),
      });
    }
    return () => {
      tools().crop.zone?.destroy();
    };
    // boundary and aspect ratio will be updated by below hook when resetting cropzone
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // redraw cropzone if default aspect ratio or canvas size change
  useLayoutEffect(() => {
    tools().crop.registerRefs(refs);
    tools().crop.resetCropzone(defaultRatio);
  }, [defaultRatio, boundaryRect]);

  const className = clsx(
    'cropzone absolute z-cropzone isolate left-0 top-0 w-full h-full overflow-hidden',
    {
      moving: isMoving,
    }
  );

  return (
    <div
      className={className}
      onPointerDown={e => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div
        className="cropzone-transition border-white/50 absolute z-10 left-0 top-0 border"
        ref={el => {
          refs.current.innerZone = el;
        }}
      >
        {!controlConfig?.hideTopLeft && (
          <CornerHandle position="top-left" inset />
        )}
        {!controlConfig?.hideTopRight && (
          <CornerHandle position="top-right" inset />
        )}
        {!controlConfig?.hideBottomLeft && (
          <CornerHandle position="bottom-left" inset />
        )}
        {!controlConfig?.hideBottomRight && (
          <CornerHandle position="bottom-right" inset />
        )}

        <Line name="lineVer1" refs={refs} />
        <Line name="lineVer2" refs={refs} />
        <Line name="lineHor1" refs={refs} />
        <Line name="lineHor2" refs={refs} />
      </div>

      <MaskPart refs={refs} position={MaskPosition.top} />
      <MaskPart refs={refs} position={MaskPosition.left} />
      <MaskPart refs={refs} position={MaskPosition.right} />
      <MaskPart refs={refs} position={MaskPosition.bottom} />
    </div>
  );
}
