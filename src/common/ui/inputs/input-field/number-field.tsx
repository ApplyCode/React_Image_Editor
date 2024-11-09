import React, {ReactElement, useRef} from 'react';
import clsx from 'clsx';
import {useLocale} from '@react-aria/i18n';
import {useNumberFieldState} from '@react-stately/numberfield';
import {useNumberField} from '@react-aria/numberfield';
import {AriaNumberFieldProps} from '@react-types/numberfield';
import {CommonInputFieldProps} from './input-field-props';
import {inputFieldStyle} from './input-field-style';
import {IconButton} from '../../buttons/icon-button';
import {KeyboardArrowUpIcon} from '../../../icons/material/KeyboardArrowUp';
import {KeyboardArrowDownIcon} from '../../../icons/material/KeyboardArrowDown';

interface Props extends AriaNumberFieldProps, CommonInputFieldProps {}
export function NumberField(props: Props) {
  const {label} = props;
  const {locale} = useLocale();
  const style = inputFieldStyle(props);
  const state = useNumberFieldState({
    ...props,
    locale,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    labelProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps,
  } = useNumberField(props, state, inputRef);

  return (
    <div className={style.wrapper}>
      {label && (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label className={style.label} {...labelProps}>
          {label}
        </label>
      )}
      <div className="relative" {...groupProps}>
        <input className={style.input} {...inputProps} ref={inputRef} />
        <div className="absolute top-0 right-0 h-full flex flex-col items-center justify-center">
          <StepButton className="border-b" {...incrementButtonProps}>
            <KeyboardArrowUpIcon />
          </StepButton>
          <StepButton {...decrementButtonProps}>
            <KeyboardArrowDownIcon />
          </StepButton>
        </div>
      </div>
    </div>
  );
}

interface StepButtonProps {
  children: ReactElement;
  className?: string;
}
function StepButton({children, className, ...other}: StepButtonProps) {
  const mergedClassName = clsx(
    className,
    'flex flex-auto items-center border-l px-2 disabled:text-disabled'
  );
  return (
    <IconButton
      variant={null}
      radius="rounded-none"
      className={mergedClassName}
      {...other}
    >
      {children}
    </IconButton>
  );
}
