import {
  AriaLabelingProps,
  AriaValidationProps,
  DOMProps,
  InputBase,
  LabelableProps,
  Validation,
  ValueBase,
} from '@react-types/shared';
import {forwardRef, ReactElement} from 'react';
import {useRadioGroupState} from '@react-stately/radio';
import {useRadioGroup} from '@react-aria/radio';
import clsx from 'clsx';
import {Orientation} from '../orientation';
import {RadioProps} from './radio';
import {RadioContext} from './radio-context';
import {inputFieldStyle} from '../input-field/input-field-style';
import {InputSize} from '../input-field/input-size';

interface RadioGroupProps
  extends DOMProps,
    AriaLabelingProps,
    AriaValidationProps,
    ValueBase<string>,
    InputBase,
    Validation,
    LabelableProps {
  /**
   * The Radio(s) contained within the RadioGroup.
   */
  children: ReactElement<RadioProps> | ReactElement<RadioProps>[];
  /**
   * The axis the Radio Button(s) should align with.
   * @default 'horizontal'
   */
  orientation?: Orientation;
  /**
   * The name of the RadioGroup, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name_and_radio_buttons).
   */
  name?: string;
  size?: InputSize;
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (props, ref) => {
    const style = inputFieldStyle(props);
    const {
      label,
      children,
      size,
      className,
      orientation = 'horizontal',
    } = props;

    const state = useRadioGroupState(props);
    const {radioGroupProps, labelProps} = useRadioGroup(props, state);

    return (
      <div
        className={clsx('text-left', className)}
        {...radioGroupProps}
        ref={ref}
      >
        {label && (
          <span className={style.label} {...labelProps}>
            {label}
          </span>
        )}
        <div
          className={clsx(
            'flex',
            orientation === 'vertical' ? 'flex-col gap-10' : 'flex-row gap-16'
          )}
        >
          <RadioContext.Provider
            value={{
              state,
              size,
            }}
          >
            {children}
          </RadioContext.Provider>
        </div>
      </div>
    );
  }
);
