import {FormattedMessage} from 'react-intl';
import {Item} from '@react-stately/collections';
import {useStore} from '../../../state/store';
import {ToolControlsOverlayWrapper} from '../../../ui/navbar/tool-controls-overlay-wrapper';
import {ColorPickerButton} from '../../../ui/color-picker-button';
import {FabricFilter} from '../filter-tool';
import {Slider} from '../../../common/ui/inputs/slider/slider';
import {filterOptionMessages} from '../filter-list';
import {state, tools} from '../../../state/utils';
import {Picker} from '../../../common/ui/inputs/select/picker';

export function FilterControls() {
  const selectedFilter = useStore(s => s.filter.selected);
  if (!selectedFilter) return null;
  const options = tools().filter.getByName(selectedFilter).options;

  const applyValue = async (optionName: string, value: string | number) => {
    tools().filter?.applyValue(selectedFilter, optionName, value);
    await state().saveChanges();
  };

  const activeFilters = tools().canvas.getMainImage().filters as FabricFilter[];
  const i = tools().filter.findFilterIndex(selectedFilter, activeFilters);
  const fabricFilter = activeFilters?.[i];

  if (options) {
    const controls = Object.entries(options).map(([optionName, config]) => {
      let component;
      const value = fabricFilter ? fabricFilter[optionName] : config.current;
      if (config.type === 'slider') {
        component = (
          <Slider
            label={<FormattedMessage {...filterOptionMessages[optionName]} />}
            minValue={config.min}
            maxValue={config.max}
            step={config.step}
            defaultValue={value}
            formatOptions={{style: 'percent'}}
            size="sm"
            onChange={newValue => {
              applyValue(optionName, newValue);
            }}
          />
        );
      } else if (config.type === 'colorPicker') {
        component = (
          <ColorPickerButton
            label={<FormattedMessage {...filterOptionMessages[optionName]} />}
            size="sm"
            className="w-full"
            placement="left top"
            defaultValue={value}
            onChange={newValue => {
              applyValue(optionName, newValue);
            }}
          />
        );
      } else if (config.type === 'select') {
        component = (
          <Picker
            size="sm"
            label={<FormattedMessage {...filterOptionMessages[optionName]} />}
            defaultValue={value}
            onChange={newValue => {
              applyValue(optionName, newValue);
            }}
            items={config.available}
          >
            {item => (
              <Item textValue={item.key}>
                <span className="capitalize">{item.key}</span>
              </Item>
            )}
          </Picker>
        );
      }

      return (
        <div className="pb-10" key={optionName}>
          {component}
        </div>
      );
    });
    return (
      <ToolControlsOverlayWrapper>
        <div className="max-w-240 pt-10 mx-auto">{controls}</div>
      </ToolControlsOverlayWrapper>
    );
  }

  return null;
}
