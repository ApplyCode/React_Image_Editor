import {useStore} from '../../../state/store';
import {Slider} from '../../../common/ui/inputs/slider/slider';
import {state, tools} from '../../../state/utils';

export function OpacityTabPanel() {
  const opacity = useStore(s => s.objects.active.editableProps.opacity);

  return (
    <Slider
      className="max-w-240"
      aria-label="Opacity"
      value={opacity}
      minValue={0.1}
      step={0.1}
      maxValue={1}
      onChange={async newOpacity => {
        tools().objects.setValues({opacity: newOpacity});
        await state().saveChanges();
      }}
    />
  );
}
