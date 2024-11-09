import {RgbaStringColorPicker} from 'react-colorful';
import React from 'react';
import {ColorSwatch} from './color-swatch';

type Props = {
  onChange?: (e: string) => void;
  selectedColor?: string;
  colorPresets?: string[];
};
export function ColorPicker({onChange, selectedColor, colorPresets}: Props) {
  return (
    <div className="bg-paper rounded shadow-md">
      <RgbaStringColorPicker className="!w-auto" onChange={onChange} />
      {colorPresets && (
        <ColorSwatch
          colors={colorPresets}
          onChange={onChange}
          selectedColor={selectedColor}
        />
      )}
    </div>
  );
}
