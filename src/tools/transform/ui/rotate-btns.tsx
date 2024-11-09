import React from 'react';
import {IconButton} from '../../../common/ui/buttons/icon-button';
import {state, tools} from '../../../state/utils';
import {RotateLeftIcon} from '../../../common/icons/material/RotateLeft';
import {RotateRightIcon} from '../../../common/icons/material/RotateRight';

export function RotateBtns() {
  return (
    <div>
      <IconButton
        size="sm"
        onPress={async () => {
          tools().transform.rotateLeft();
          await state().saveChanges();
        }}
      >
        <RotateLeftIcon />
      </IconButton>
      <IconButton
        size="sm"
        onPress={async () => {
          tools().transform.rotateRight();
          await state().saveChanges();
        }}
      >
        <RotateRightIcon />
      </IconButton>
    </div>
  );
}
