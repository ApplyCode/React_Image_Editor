import {
  AriaLabelingProps,
  AriaValidationProps,
  DOMProps,
  InputBase,
  LabelableProps,
  Validation,
  ValueBase,
} from '@react-types/shared';
import {ReactElement, useRef} from 'react';
import {useCheckboxGroupState} from '@react-stately/checkbox';
import {useCheckboxGroup} from '@react-aria/checkbox';
import clsx from 'clsx';
import {Orientation} from '../orientation';
import {CheckboxProps} from './checkbox';
import {inputFieldStyle} from '../input-field/input-field-style';
import {CheckboxGroupContext} from './checkbox-group-context';

interface CheckboxGroupProps
  extends ValueBase<string[]>,
    InputBase,
    LabelableProps,
    AriaLabelingProps,
    DOMProps,
    AriaValidationProps,
    Validation {
  /**
   * The name of the CheckboxGroup, used when submitting an HTML form.
   */
  name?: string;
  /**
   * The Checkboxes contained within the CheckboxGroup.
   */
  children: ReactElement<CheckboxProps> | ReactElement<CheckboxProps>[];
  /**
   * The axis the checkboxes should align with.
   * @default 'vertical'
   */
  orientation?: Orientation;
}

export function CheckboxGroup(props: CheckboxGroupProps) {
  const {
    label,
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    orientation = 'vertical',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validationState,
  } = props;
  const ref = useRef(null);
  const state = useCheckboxGroupState(props);
  const style = inputFieldStyle(props);
  const {labelProps, groupProps} = useCheckboxGroup(props, state);

  return (
    <div {...groupProps} ref={ref}>
      {label && (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label {...labelProps} className={style.label}>
          {label}
        </label>
      )}
      <div
        role="presentation"
        className={clsx(
          'flex gap-6',
          orientation === 'vertical' ? 'flex-col' : 'flow-row'
        )}
      >
        <CheckboxGroupContext.Provider value={state}>
          {children}
        </CheckboxGroupContext.Provider>
      </div>
    </div>
  );
}
