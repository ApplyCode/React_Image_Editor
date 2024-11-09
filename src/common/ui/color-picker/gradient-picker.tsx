import {fabric} from 'fabric';
import React, {useState} from 'react';
import {tools} from '../../../state/utils';
import {ButtonBase} from '../buttons/button-base';
import {PopoverTrigger} from '../overlays/popover/popover-trigger';
// @ts-ignore
import {SketchPicker} from 'react-color';
// @ts-ignore
import {GradientPicker} from 'react-linear-gradient-picker';
import 'react-linear-gradient-picker/dist/index.css';

const rgbToRgba = (rgb: string, a = 1) =>
  rgb.replace('rgb(', 'rgba(').replace(')', `, ${a})`);

const WrappedSketchPicker = ({
  onSelect,
  ...rest
}: {
  onSelect?: any;
  [key: string]: any;
}) => {
  return (
    <SketchPicker
      {...rest}
      color={rgbToRgba(rest.color, rest.opacity)}
      onChange={(c: any) => {
        const {r, g, b, a} = c.rgb;
        onSelect(`rgb(${r}, ${g}, ${b})`, a);
      }}
    />
  );
};

const GradientPickerPopup = ({
  property,
  type,
}: {
  property: string;
  type: 'gradient' | 'texture';
}) => {
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState([
    {offset: '0.00', color: 'rgb(238, 241, 11)'},
    {offset: '0.49', color: 'rgb(215, 128, 37)'},
    {offset: '1.00', color: 'rgb(126, 32, 207)'},
  ]);
  return (
    <div>
      {type === 'gradient' && (
        <PopoverTrigger
          placement="bottom left"
          trigger={
            <ButtonBase
              radius="rounded"
              className={'w-56 h-56 bg border shadow-sm hover:scale-110'}
              aria-label={`Select Gradient`}
              onPress={() => {
                tools().objects.setValues({
                  [property]: new fabric.Gradient({
                    colorStops: [...palette].map(({offset, color}) => ({
                      offset: +offset,
                      color,
                    })),
                    coords: {
                      x1: 0,
                      y1: 0,
                      x2: tools().objects.getActive()?.width,
                      y2: tools().objects.getActive()?.height,
                    },
                  }),
                });

                setOpen(true);
              }}
              style={{
                backgroundImage: `linear-gradient(to right, ${palette
                  .map(({color, offset}) => `${color} ${+offset * 100}%`)
                  .join(', ')})`,
              }}
            ></ButtonBase>
          }
          state={{
            isOpen: open,
            open: () => setOpen(true),
            close: () => setOpen(false),
            toggle: () => setOpen(!open),
          }}
        >
          <GradientPicker
            {...{
              width: 320,
              paletteHeight: 32,
              open,
              setOpen,
              palette,
              onPaletteChange: (p: {offset: string; color: string}[]) => {
                setPalette(p);
                tools().objects.setValues({
                  [property]: new fabric.Gradient({
                    colorStops: [...p].map(({offset, color}) => ({
                      offset: +offset,
                      color,
                    })),
                    coords: {
                      x1: 0,
                      y1: 0,
                      x2: tools().objects.getActive()?.width,
                      y2: tools().objects.getActive()?.height,
                    },
                  }),
                });
              },
            }}
          >
            <WrappedSketchPicker />
          </GradientPicker>
        </PopoverTrigger>
      )}
    </div>
  );
};

export default GradientPickerPopup;
