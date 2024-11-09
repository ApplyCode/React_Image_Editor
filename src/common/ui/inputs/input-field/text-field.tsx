import React, {forwardRef, useRef} from 'react';
import {AriaTextFieldOptions, useTextField} from '@react-aria/textfield';
import {CommonInputFieldProps} from './input-field-props';
import {inputFieldStyle} from './input-field-style';
import {Adornment} from './adornment';

interface TextFieldProps
  extends AriaTextFieldOptions<'input'>,
    CommonInputFieldProps {}

export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  (props, ref) => {
    const style = inputFieldStyle(props);
    const inputRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {labelProps, inputProps, descriptionProps, errorMessageProps} =
      useTextField(props, inputRef);
    const {label, startAdornment, endAdornment} = props;

    return (
      <div className={style.wrapper} ref={ref}>
        {label && (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label className={style.label} {...labelProps}>
            {label}
          </label>
        )}
        <div className="relative">
          <Adornment direction="start">{startAdornment}</Adornment>
          <input className={style.input} {...inputProps} />
          <Adornment direction="end">{endAdornment}</Adornment>
        </div>
      </div>
    );
  }
);
