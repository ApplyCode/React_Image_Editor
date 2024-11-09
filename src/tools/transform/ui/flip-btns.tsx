import React from 'react';
import {IconButton} from '../../../common/ui/buttons/icon-button';
import {state, tools} from '../../../state/utils';
import {FlipIcon} from '../../../common/icons/material/Flip';

export function FlipBtns() {
  return (
    <div>
      <IconButton
        size="sm"
        onPress={async () => {
          tools().transform.flip('vertical');
          await state().saveChanges();
        }}
      >
        <FlipIcon />
      </IconButton>
      <IconButton
        size="sm"
        onPress={async () => {
          tools().transform.flip('horizontal');
          await state().saveChanges();
        }}
      >
        <FlipIcon className="rotate-90" />
      </IconButton>
    </div>
  );
}
