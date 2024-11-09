import React, {useEffect} from 'react';
import {CropPresetBtns} from './crop-preset-btns';
import {TransformWidget} from '../../../transform/ui/transform-widget';
import {state, tools} from '../../../../state/utils';

export function CropNav() {
  useEffect(() => {
    state().saveChanges();
    tools().frame.active.hide();
    return () => {
      tools().frame.active.show();
    };
  }, []);

  return (
    <div className="pb-16 w-full">
      <div className="mb-10">
        <TransformWidget />
      </div>
      <CropPresetBtns />
    </div>
  );
}
