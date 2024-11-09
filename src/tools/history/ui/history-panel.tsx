import {FormattedMessage} from 'react-intl';
import React from 'react';
import {m} from 'framer-motion';
import clsx from 'clsx';
import {useStore} from '../../../state/store';
import {Button} from '../../../common/ui/buttons/button';
import {HISTORY_DISPLAY_NAMES} from '../history-display-names';
import {popoverStyle} from '../../../common/ui/overlays/popover/popover-style';
import {IconButton} from '../../../common/ui/buttons/icon-button';
import {PopoverAnimation} from '../../../common/ui/overlays/popover/popover-animation';
import {state, tools} from '../../../state/utils';
import {CloseIcon} from '../../../common/icons/material/Close';

export function HistoryPanel() {
  const items = useStore(s => s.history.items);
  const pointer = useStore(s => s.history.pointer);

  return (
    <m.div
      {...PopoverAnimation}
      className={`absolute bottom-20 overflow-auto flex flex-col right-20 w-224 max-w-[calc(100%-40px)] max-h-[calc(100%-40px)] ${popoverStyle}`}
    >
      <div className="p-8 mb-4 bg-alt dark:bg-paper font-medium text-sm border-b flex items-center">
        <FormattedMessage defaultMessage="History" />
        <IconButton
          className="ml-auto flex-shrink-0"
          onPress={() => {
            state().togglePanel('history', false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="p-8 h-full overflow-auto tiny-scrollbar">
        {items.map(item => {
          const isActive = item.id === items[pointer].id;
          const displayName = HISTORY_DISPLAY_NAMES[item.name];
          const startIcon =
            displayName.icon &&
            React.createElement(displayName.icon, {className: 'icon-sm'});
          return (
            <Button
              onPress={() => {
                if (isActive) return;
                tools().history.load(item);
              }}
              variant="outline"
              color={isActive ? 'primary' : null}
              size="sm"
              className={clsx('w-full mb-8', isActive && 'pointer-events-none')}
              justify="justify-start"
              key={item.id}
              startIcon={startIcon}
            >
              <FormattedMessage {...displayName.name} />
            </Button>
          );
        })}
      </div>
    </m.div>
  );
}
