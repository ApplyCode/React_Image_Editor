import React, {useEffect} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {Checkbox} from '../../../common/ui/inputs/checkbox/checkbox';
import {useStore} from '../../../state/store';
import {aspectToHeight, aspectToWidth} from '../clamp-resize-payload';
import {NumberField} from '../../../common/ui/inputs/input-field/number-field';
import {state} from '../../../state/utils';
import {LockIcon} from '../../../common/icons/material/Lock';
import {LockOpenIcon} from '../../../common/icons/material/LockOpen';

export function ResizeNav() {
  const {formatMessage} = useIntl();
  const {
    minWidth = 50,
    minHeight = 50,
    maxHeight = 2400,
    maxWidth = 2400,
  } = useStore(s => s.config.tools?.resize) || {};
  const originalSize = useStore(s => s.original);
  const formVal = useStore(s => s.resize.formValue);

  useEffect(() => {
    state().resize.setFormValue({...originalSize});
  }, [originalSize]);

  useEffect(() => {
    // setting dirty in above useEffect will prevent tool selection after resize
    state().saveChanges();
  }, []);

  const onWidthChange = (newWidth: number) => {
    const newVal = {...formVal, width: newWidth};
    if (formVal.maintainAspect) {
      newVal.height = aspectToHeight(newWidth, formVal.usePercentages);
    }
    state().resize.setFormValue(newVal);
  };

  const onHeightChange = (newHeight: number) => {
    const newVal = {...formVal, height: newHeight};
    if (newHeight && formVal.maintainAspect) {
      newVal.width = aspectToWidth(newHeight, formVal.usePercentages);
    }
    state().resize.setFormValue(newVal);
  };

  const onAspectChange = (isChecked: boolean) => {
    const newVal = {...formVal, maintainAspect: isChecked};
    if (isChecked) {
      newVal.height = aspectToHeight(newVal.width, newVal.usePercentages);
    }
    state().resize.setFormValue(newVal);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    state().saveChanges();
  };

  return (
    <form
      className="flex items-center justify-center gap-16 w-full"
      onSubmit={onSubmit}
    >
      <NumberField
        minValue={minWidth}
        maxValue={maxWidth}
        size="sm"
        className="max-w-112"
        label="Width"
        value={formVal.width}
        onChange={onWidthChange}
        formatOptions={{
          useGrouping: false,
        }}
      />
      <div className="mt-24">
        <Checkbox
          size="md"
          isSelected={formVal.maintainAspect}
          onChange={onAspectChange}
          aria-label={formatMessage({defaultMessage: 'Maintain aspect ratio'})}
          checkedIcon={LockIcon}
          icon={LockOpenIcon}
        />
      </div>
      <NumberField
        minValue={minHeight}
        maxValue={maxHeight}
        size="sm"
        className="max-w-112"
        label="Height"
        value={formVal.height}
        onChange={onHeightChange}
        formatOptions={{
          useGrouping: false,
        }}
      />
      <button type="submit" className="hidden">
        <FormattedMessage defaultMessage="Resize" />
      </button>
    </form>
  );
}
