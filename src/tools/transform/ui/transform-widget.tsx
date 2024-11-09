import React, {useRef} from 'react';
import {AriaSliderProps} from '@react-types/slider';
import {SliderStateOptions, useSliderState} from '@react-stately/slider';
import {useSlider} from '@react-aria/slider';
import {useNumberFormatter} from '@react-aria/i18n';
import {FlipBtns} from './flip-btns';
import {RotateBtns} from './rotate-btns';
import {state, tools} from '../../../state/utils';

export function TransformWidget() {
  return (
    <div className="flex items-center justify-center gap-16">
      <FlipBtns />
      <StraightenSlider />
      <RotateBtns />
    </div>
  );
}

function StraightenSlider() {
  const numberFormatter = useNumberFormatter();
  const trackRef = useRef<HTMLDivElement>(null!);
  const svgRef = useRef<SVGSVGElement>(null!);
  const sliderStateOptions: SliderStateOptions & AriaSliderProps = {
    minValue: -45,
    maxValue: 45,
    step: 1,
    label: 'Straighten',
    numberFormatter,
    defaultValue: [state().crop.straightenAngle],
    onChange: async (val: number[]) => {
      const newValue = val[0];
      tools().transform.straighten(newValue);
      state().crop.setTransformAngle(newValue);
      await state().saveChanges();
      svgRef.current.style.transform = `translateX(${newValue}px)`;
    },
  };

  const sliderState = useSliderState(sliderStateOptions);
  const {groupProps, trackProps, outputProps} = useSlider(
    sliderStateOptions,
    sliderState,
    trackRef
  );

  return (
    <div
      {...groupProps}
      className="flex-auto flex-shrink-0 max-w-320 touch-none isolate"
    >
      <div {...trackProps} ref={trackRef} className="h-36 relative">
        <output
          {...outputProps}
          className="absolute left-1/2 top-1/2 w-40 text-center bg -translate-x-1/2 -translate-y-1/2 z-10"
        >
          {sliderState.getThumbValueLabel(0)}°
        </output>
        <FreeTransformTrack ref={svgRef} />
      </div>
    </div>
  );
}

const FreeTransformTrack = React.forwardRef<SVGSVGElement>((props, ref) => {
  const numberOfDots = [...Array(80).keys()];
  const circles = numberOfDots.map(index => {
    return (
      <circle
        key={index}
        cx={2 + index * 10}
        cy="20"
        r={!(index % 5) ? 2 : 0.75}
      />
    );
  });

  return (
    <div className="relative h-full cursor-pointer overflow-hidden">
      <svg
        ref={ref}
        style={{width: numberOfDots.length * 10}}
        className="absolute -left-80 h-full fill-current"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {circles}
      </svg>
    </div>
  );
});
