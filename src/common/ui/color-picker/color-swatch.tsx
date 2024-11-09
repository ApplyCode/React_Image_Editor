import React from 'react';
import clsx from 'clsx';
import {ButtonBase} from '../buttons/button-base';

type Props = {
  onChange?: (e: string) => void;
  selectedColor?: string;
  colors: string[];
};
export function ColorSwatch({onChange, selectedColor, colors}: Props) {
  const presetBtns = colors.map(color => {
    const isSelected = selectedColor === color;
    return (
      <ButtonBase
        key={color}
        onPress={() => {
          onChange?.(color);
        }}
        className={clsx(
          'relative block flex-shrink-0 w-26 h-26 border rounded',
          isSelected && 'shadow-md',
          color === 'rgba(255, 255, 255, 0)' &&
            `after:w-2 after:h-full after:absolute after:top-1/2 after:left-1/2 after:rotate-45 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-red`
        )}
        style={{
          background: color,
          borderColor: color === 'rgba(255, 255, 255, 0)' ? `red` : '',
        }}
      >
        {isSelected && (
          <span className="absolute inset-0 m-auto rounded-full w-8 h-8 bg-white" />
        )}
      </ButtonBase>
    );
  });

  return <div className="flex gap-6 p-12">{presetBtns}</div>;
}
