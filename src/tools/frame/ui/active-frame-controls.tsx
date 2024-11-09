import {FormattedMessage} from 'react-intl';
import {useStore} from '../../../state/store';
import {ColorPickerButton} from '../../../ui/color-picker-button';
import {ToolControlsOverlayWrapper} from '../../../ui/navbar/tool-controls-overlay-wrapper';
import {Slider} from '../../../common/ui/inputs/slider/slider';
import {tools} from '../../../state/utils';

export function ActiveFrameControls() {
  const activeFrame = useStore(s => s.frame.active);

  const showColorPicker = activeFrame?.mode === 'basic';

  return (
    <ToolControlsOverlayWrapper className="pb-18 pt-6">
      <div className="max-w-288 m-auto p-10">
        {showColorPicker && (
          <div className="mb-16">
            <ColorPickerButton
              size="sm"
              placement="left top"
              label={<FormattedMessage defaultMessage="Color" />}
              value={tools().frame.builder.defaultColor}
              onChange={newColor => {
                tools().frame.active.changeColor(newColor);
              }}
            />
          </div>
        )}
        <Slider
          size="sm"
          label={<FormattedMessage defaultMessage="Size" />}
          step={1}
          minValue={tools().frame.active.getMinSize()}
          maxValue={tools().frame.active.getMaxSize()}
          defaultValue={tools().frame.active.currentSizeInPercent}
          getValueLabel={value => {
            return `${value}%`;
          }}
          onChange={value => {
            tools().frame.resize(value);
          }}
        />
      </div>
    </ToolControlsOverlayWrapper>
  );
}
