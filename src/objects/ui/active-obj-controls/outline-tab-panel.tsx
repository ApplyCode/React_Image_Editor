import {useIntl} from 'react-intl';
import {useStore} from '../../../state/store';
import {ColorPickerButton} from '../../../ui/color-picker-button';
import {Slider} from '../../../common/ui/inputs/slider/slider';
import {state, tools} from '../../../state/utils';
import {useIsMobileDevice} from '../../../common/utils/hooks/is-mobile-device';

export function OutlineTabPanel() {
  const {formatMessage} = useIntl();
  const outlineColor = useStore(s => s.objects.active.editableProps.stroke);
  const outlineWidth = useStore(
    s => s.objects.active.editableProps.strokeWidth
  );
  const active = useStore(s => s.objects.active);
  const isMobile = useIsMobileDevice();
  return (
    <>
      <ColorPickerButton
        size="xs"
        value={outlineColor}
        placement="left top"
        fullWidth={!isMobile}
        aria-label={formatMessage({defaultMessage: 'Outline Color'})}
        onChange={async newColor => {
          tools().objects.setValues({stroke: newColor});
          await state().saveChanges();
        }}
      />
      <Slider
        aria-label="Outline Width"
        className="max-w-240"
        value={outlineWidth}
        onChange={async newWidth => {
          tools().objects.setValues({strokeWidth: newWidth});
          await state().saveChanges();
        }}
      />
    </>
  );
}
