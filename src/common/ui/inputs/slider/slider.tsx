import React, {ReactNode, RefObject, useRef} from 'react';
import {NumberFormatOptions} from '@internationalized/number';
import {AriaSliderProps, AriaSliderThumbProps} from '@react-types/slider';
import clsx from 'clsx';
import {
  SliderState,
  SliderStateOptions,
  useSliderState,
} from '@react-stately/slider';
import {useNumberFormatter} from '@react-aria/i18n';
import {useSlider, useSliderThumb} from '@react-aria/slider';
import {useFocusRing} from '@react-aria/focus';
import {useHover} from '@react-aria/interactions';
import {mergeProps} from '@react-aria/utils';
import {VisuallyHidden} from '@react-aria/visually-hidden';
import {InputSize} from '../input-field/input-size';
import {inputFieldStyle} from '../input-field/input-field-style';

export interface SliderProps<T = number> extends AriaSliderProps<T> {
  size?: InputSize;
  label?: ReactNode;
  inline?: boolean;
  className?: string;
  formatOptions?: NumberFormatOptions;
  getValueLabel?: (value: T) => string;
  showValueLabel?: boolean;
  onChange?: (value: T) => void;
  onChangeEnd?: (value: T) => void;
  value?: T;
  defaultValue?: T;
}
export function Slider(props: SliderProps) {
  const {
    size = 'md',
    onChange,
    onChangeEnd,
    value,
    defaultValue,
    formatOptions,
    inline,
    label,
    getValueLabel,
    showValueLabel = !!label,
    className,
    isDisabled,
    ...otherProps
  } = props;

  const numberFormatter = useNumberFormatter(formatOptions);
  const style = inputFieldStyle({size});
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderStateOptions: SliderStateOptions & AriaSliderProps = {
    ...otherProps,
    isDisabled,
    label,
    numberFormatter,
    value: value != null ? [value] : undefined,
    defaultValue: defaultValue != null ? [defaultValue] : undefined,
    onChange: v => onChange?.(v[0]),
    onChangeEnd: v => onChangeEnd?.(v[0]),
  };

  const state = useSliderState(sliderStateOptions);
  const {groupProps, trackProps, labelProps, outputProps} = useSlider(
    sliderStateOptions,
    state,
    trackRef
  );

  const wrapperClassname = clsx('w-full flex-shrink-0 touch-none', className, {
    'flex items-center': inline,
  });

  return (
    <div {...groupProps} className={wrapperClassname}>
      <div className="flex">
        {label && (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label className={style.label} {...labelProps}>
            {label}
          </label>
        )}
        {showValueLabel && (
          <output {...outputProps} className={clsx(style.label, 'ml-auto')}>
            {getValueLabel
              ? getValueLabel(state.values[0])
              : state.getThumbValueLabel(0)}
          </output>
        )}
      </div>
      <div {...trackProps} ref={trackRef} className="h-30 relative">
        <div
          className={`absolute inset-0 m-auto h-4 rounded ${
            isDisabled ? 'bg-disabled' : 'bg-primary-light'
          }`}
        />
        <div
          className={`absolute inset-0 my-auto h-4 rounded ${
            isDisabled ? 'bg-disabled-fg' : 'bg-primary'
          }`}
          style={{width: `${state.getThumbPercent(0) * 100}%`}}
        />
        <Thumb
          index={0}
          state={state}
          trackRef={trackRef}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
}

interface ThumbProps extends AriaSliderThumbProps {
  trackRef: RefObject<HTMLElement>;
  inputRef?: RefObject<HTMLInputElement>;
  state: SliderState;
}
function Thumb(props: ThumbProps) {
  const {state, trackRef, index, isDisabled} = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const {thumbProps, inputProps} = useSliderThumb(
    {
      index,
      trackRef,
      inputRef,
    },
    state
  );

  const isDragging = state.isThumbDragging(index);
  const {focusProps, isFocusVisible} = useFocusRing();
  const {hoverProps, isHovered} = useHover({
    ...props,
    isDisabled,
  });

  const innerClassName = clsx(
    'rounded-full w-20 h-20 top-1/2 -translate-y-1/2 -translate-x-1/2 absolute inset-0 transition-colors duration-200',
    {
      'outline outline-offset-2': isFocusVisible && !isDisabled,
      'shadow-md': !isDisabled,
    },
    thumbColor({isDisabled, isHovered, isDragging})
  );

  return (
    <div
      {...mergeProps(thumbProps, hoverProps)}
      className={innerClassName}
      style={{
        left: `${Math.max(state.getThumbPercent(index) * 100, 0)}%`,
      }}
    >
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
}

interface ThumbColorProps {
  isDisabled?: boolean;
  isHovered: boolean;
  isDragging: boolean;
}
function thumbColor({
  isDisabled,
  isHovered,
  isDragging,
}: ThumbColorProps): string {
  if (isDisabled) {
    return 'bg-slider-disabled cursor-default';
  }
  if (isDragging) {
    return 'bg-primary-dark ring ring-primary-light ring-inset';
  }
  if (isHovered) {
    return 'bg-primary-dark';
  }
  return 'bg-primary';
}
