import React from 'react';
import {inputFieldStyle} from '../input-field/input-field-style';
import {CommonInputFieldProps} from '../input-field/input-field-props';

interface Props
  extends CommonInputFieldProps,
    Omit<React.ComponentPropsWithoutRef<'select'>, 'size'> {}
export function NativeSelect(props: Props) {
  const style = inputFieldStyle(props);
  const {label, id, children, size, ...other} = {...props};
  return (
    <div className={style.wrapper}>
      {label && (
        <label className={style.label} htmlFor={id}>
          {label}
        </label>
      )}
      <select id={id} className='text-left relative focus:ring focus:ring-primary/focus focus:border-primary/60 block w-full bg-transparent border rounded transition-shadow text-base h-42 pl-12 pr-12' {...other}>
        {children}
      </select>
    </div>
  );
}
