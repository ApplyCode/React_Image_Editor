import React, {useState} from 'react';
import {ValueBase} from '@react-types/shared';
import clsx from 'clsx';
import {AriaFieldProps, useField} from '@react-aria/label';
import {ColorPicker} from '../common/ui/color-picker/color-picker';
import {useStore} from '../state/store';
import {inputFieldStyle} from '../common/ui/inputs/input-field/input-field-style';
import {CommonInputFieldProps} from '../common/ui/inputs/input-field/input-field-props';
import {DialogTrigger} from '../common/ui/overlays/dialog-trigger/dialog-trigger';
import {ButtonBase} from '../common/ui/buttons/button-base';
import {Dialog} from '../common/ui/overlays/dialog/dialog';
import {KeyboardArrowDownIcon} from '../common/icons/material/KeyboardArrowDown';
import {Placement} from '@react-types/overlays';
interface ColorPickerButtonProps
  extends AriaFieldProps,
    ValueBase<string>,
    CommonInputFieldProps {
  fullWidth?: boolean;
  placement?: Placement;
}

export function ColorPickerButton(props: ColorPickerButtonProps) {
  const {label, className, value, onChange, size} = props;
  const colors = useStore(s => s.config.ui?.colorPresets?.items) || [];
  const style = inputFieldStyle({size});
  const [selectedColor, setSelectedColor] = useState(value);

  const {labelProps, fieldProps} = useField({
    labelElementType: 'span',
    ...props,
  });

  const onColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    onChange?.(newColor);
  };
  return (
    <div className={className}>
      {label && (
        <span className={style.label} {...labelProps}>
          {label}
        </span>
      )}
      <DialogTrigger
        type="popover"
        placement={props.placement ?? 'bottom'}
        hideArrow
      >
        {state => (
          <ButtonBase
            className={clsx(style.input, 'inline-flex items-center')}
            {...fieldProps}
          >
            <span
              className={clsx(
                'block flex-shrink-0 mr-5 border rounded h-2/4',
                props.fullWidth ? 'aspect-[8] inline-block' : 'aspect-square'
              )}
              style={{
                backgroundColor: selectedColor,
                borderColor:
                  selectedColor?.split(',')?.[3]?.trim() === '0)'
                    ? 'red'
                    : 'inherit',
              }}
            />
            <ArrowIcon isActive={state.isOpen} className={style.adornment} />
          </ButtonBase>
        )}
        <Dialog>
          <ColorPicker
            onChange={onColorChange}
            selectedColor={selectedColor}
            colorPresets={colors}
          />
        </Dialog>
      </DialogTrigger>
    </div>
  );
}

type ArrowProps = {
  isActive: boolean;
  className: string;
};

export function ArrowIcon({isActive, className}: ArrowProps) {
  const rotation = isActive ? 'rotate-180' : 'rotate-0';
  return (
    <KeyboardArrowDownIcon
      className={`transition-transform ml-auto flex-shrink-0 ${rotation} ${className}`}
    />
  );
}
