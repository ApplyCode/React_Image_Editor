import {AriaLabelingProps, DOMProps, FocusableProps} from '@react-types/shared';
import {ReactNode, useRef} from 'react';
import {useHover} from '@react-aria/interactions';
import {useRadio} from '@react-aria/radio';
import {useFocusRing} from '@react-aria/focus';
import {VisuallyHidden} from '@react-aria/visually-hidden';
import {AnimatePresence, m} from 'framer-motion';
import clsx from 'clsx';
import {mergeProps} from '@react-aria/utils';
import {useRadioProvider} from './radio-context';
import {InputSize} from '../input-field/input-size';

export interface RadioProps
  extends FocusableProps,
    DOMProps,
    AriaLabelingProps {
  /**
   * The value of the radio button, used when submitting an HTML form.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#Value).
   */
  value: string;
  /**
   * The label for the Radio. Accepts any renderable node.
   */
  children?: ReactNode;
  /**
   * Whether the radio button is disabled or not.
   * Shows that a selection exists, but is not available in that circumstance.
   */
  isDisabled?: boolean;
}

export function Radio(props: RadioProps) {
  const {isDisabled, children, autoFocus, value} = props;
  const {hoverProps, isHovered} = useHover({isDisabled});
  const {isFocusVisible, focusProps} = useFocusRing(props);

  const inputRef = useRef<HTMLInputElement>(null);

  const radioGroupProps = useRadioProvider();
  const {state, size} = radioGroupProps;
  const isSelected = state.selectedValue === value;

  const {inputProps} = useRadio(
    {
      ...props,
      ...radioGroupProps,
      isDisabled,
    },
    state,
    inputRef
  );

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={clsx(
        'inline-flex gap-8 cursor-pointer select-none items-center whitespace-nowrap align-middle',
        isDisabled && 'text-disabled pointer-events-none'
      )}
      {...hoverProps}
    >
      <VisuallyHidden>
        <input {...mergeProps(inputProps, focusProps)} ref={inputRef} />
      </VisuallyHidden>
      <span
        className={clsx(
          'block relative shrink-0',
          circleSize(size),
          isFocusVisible && 'outline outline-offset-2 rounded-full'
        )}
      >
        <span
          className={clsx(
            'absolute left-0 top-o w-full h-full block transition-colors duration-200 border-2 rounded-full',
            circleColor(isSelected, isHovered, isDisabled)
          )}
        />
        <AnimatePresence>
          {isSelected && (
            <m.span
              key="radio-inner"
              className={clsx(
                'rounded-full w-full h-full block left-0 top-o absolute',
                isHovered ? 'bg-primary-dark' : 'bg-primary'
              )}
              initial={{scale: 0.01}}
              animate={{scale: 0.5}}
              exit={{scale: 0.01}}
              transition={{type: 'tween', duration: 0.2}}
            />
          )}
        </AnimatePresence>
      </span>
      {children && <span>{children}</span>}
    </label>
  );
}

function circleSize(size?: InputSize): string {
  switch (size) {
    case 'xs':
      return 'h-12 w-12';
    case 'sm':
      return 'h-16 w-16';
    case 'lg':
      return 'h-24 w-24';
    case 'xl':
      return 'h-36 w-36';
    default:
      return 'h-20 w-20';
  }
}

function circleColor(
  isSelected: boolean,
  isHovered: boolean,
  isDisabled?: boolean
): string {
  if (isDisabled) {
    return 'border-disabled-fg';
  }
  if (isSelected) {
    return isHovered ? 'border-primary-dark' : 'border-primary';
  }
  return isHovered ? 'border-text-main' : 'border-text-muted ';
}
