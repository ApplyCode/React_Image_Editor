import {fabric} from 'fabric';
import React from 'react';
import {IShadowOptions, Shadow} from 'fabric/fabric-impl';
import {useIntl} from 'react-intl';
import {useStore} from '../../../state/store';
import {ColorPickerButton} from '../../../ui/color-picker-button';
import {Slider} from '../../../common/ui/inputs/slider/slider';
import {state, tools} from '../../../state/utils';
import {useIsMobileMediaQuery} from '../../../common/utils/hooks/is-mobile-media-query';

const shadowDefaults = {
  color: 'rgba(0, 0, 0, 0.6)',
  blur: 3,
  offsetX: -1,
  offsetY: 0,
};

export function ShadowTabPanel() {
  const {formatMessage} = useIntl();
  const shadow =
    useStore(s => s.objects.active.editableProps.shadow) || shadowDefaults;
  const isMobile = useIsMobileMediaQuery();
  return (
    <>
      <ColorPickerButton
        value={shadow.color}
        size="xs"
        fullWidth={!isMobile}
        placement="left top"
        aria-label={formatMessage({defaultMessage: 'Shadow Color'})}
        onChange={async color => {
          tools().objects.setValues({shadow: modifiedShadow({color})});
          await state().saveChanges();
        }}
      />
      <Slider
        aria-label="Shadow Blur"
        className="max-w-240"
        defaultValue={shadow.blur}
        label={formatMessage({defaultMessage: 'Blur'})}
        onChange={async blur => {
          tools().objects.setValues({
            shadow: modifiedShadow({blur}),
          });
          await state().saveChanges();
        }}
      />
      {!isMobile && (
        <>
          <Slider
            aria-label="Shadow Offset X"
            className="max-w-240"
            minValue={-30}
            maxValue={30}
            defaultValue={shadow.offsetX}
            label={formatMessage({defaultMessage: 'Offset X'})}
            onChange={async offsetX => {
              tools().objects.setValues({
                shadow: modifiedShadow({offsetX}),
              });
              await state().saveChanges();
            }}
          />
          <Slider
            aria-label="Shadow Offset Y"
            className="max-w-240"
            minValue={-30}
            maxValue={30}
            defaultValue={shadow.offsetY}
            label={formatMessage({defaultMessage: 'Offset Y'})}
            onChange={async offsetY => {
              tools().objects.setValues({
                shadow: modifiedShadow({offsetY}),
              });
              await state().saveChanges();
            }}
          />
        </>
      )}
    </>
  );
}

function modifiedShadow(options: IShadowOptions) {
  const current = tools().objects.getActive()?.shadow as Shadow | null;
  if (current) {
    Object.entries(options).forEach(([key, val]) => {
      current[key as keyof IShadowOptions] = val;
    });
    return current;
  }
  return new fabric.Shadow({
    ...shadowDefaults,
    ...options,
  });
}
