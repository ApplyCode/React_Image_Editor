import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {useStore} from '../../../../state/store';
import {InteractableRect} from '../../../../common/ui/interactions/interactable-rect';
import {ResizeAction} from '../../../../common/ui/interactions/actions/resize-action';
import {NumberField} from '../../../../common/ui/inputs/input-field/number-field';
import {state, tools} from '../../../../state/utils';

export function CropInputFields() {
  const width = useStore(s => s.crop.zoneRect?.width) || 1;
  const height = useStore(s => s.crop.zoneRect?.height) || 1;

  const [formVal, setFormVal] = useState({width, height});

  // update inputs whenever cropzone size is changed via drag and drop
  useEffect(() => {
    const newWidth = Math.round(width / state().zoom);
    const newHeight = Math.round(height / state().zoom);
    setFormVal({width: newWidth, height: newHeight});
  }, [width, height]);

  const onInputChange = (value: number, dimension: 'width' | 'height') => {
    const newValue = {
      ...formVal,
      // only allow numbers in input
      [dimension]: value,
    };
    setFormVal(newValue);
    onBlurAndSubmit(newValue);
  };

  const onBlurAndSubmit = (newValue?: {width: number; height: number}) => {
    const value = newValue || formVal;
    resizeCropzone(value.width, value.height);
  };

  return (
    <form
      className="flex items-center gap-12"
      onSubmit={e => {
        e.preventDefault();
        onBlurAndSubmit();
      }}
    >
      <NumberField
        size="xs"
        aria-label="Crop width"
        endAdornment={
          <div className="text-muted font-bold text-xs">
            <FormattedMessage
              defaultMessage="W"
              description="Width shorthand"
            />
          </div>
        }
        minValue={1}
        className="w-80"
        value={formVal.width}
        formatOptions={{useGrouping: false}}
        onChange={value => {
          onInputChange(value, 'width');
        }}
      />
      <NumberField
        size="xs"
        aria-label="Crop height"
        endAdornment={
          <div className="text-muted font-bold text-xs">
            <FormattedMessage
              defaultMessage="H"
              description="Height shorthand"
            />
          </div>
        }
        minValue={1}
        className="w-80"
        value={formVal.height}
        formatOptions={{useGrouping: false}}
        onChange={value => {
          onInputChange(value, 'height');
        }}
      />
      <button type="submit" className="hidden">
        <FormattedMessage defaultMessage="Resize" />
      </button>
    </form>
  );
}

function resizeCropzone(width: number, height: number) {
  const interactable = tools().crop.zone;
  if (!state().crop.zoneRect || !interactable) return;
  const newRect: InteractableRect = {
    ...state().crop.zoneRect!,
    width: Math.round(Math.min(state().original.width, width) * state().zoom),
    height: Math.round(
      Math.min(state().original.height, height) * state().zoom
    ),
  };
  const resizeAction = interactable.config.actions.find(
    a => a instanceof ResizeAction
  );
  if (
    (resizeAction && newRect.width !== interactable.currentRect.width) ||
    newRect.height !== interactable.currentRect.height
  ) {
    interactable.executeAction(resizeAction!, {} as any, newRect);
  }
}
