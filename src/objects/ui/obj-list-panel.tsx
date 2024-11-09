import {FormattedMessage} from 'react-intl';
import {m} from 'framer-motion';
import clsx from 'clsx';
import React from 'react';
import {useStore} from '../../state/store';
import {PopoverAnimation} from '../../common/ui/overlays/popover/popover-animation';
import {popoverStyle} from '../../common/ui/overlays/popover/popover-style';
import {IconButton} from '../../common/ui/buttons/icon-button';
import {state, tools} from '../../state/utils';
import {CloseIcon} from '../../common/icons/material/Close';
import {Button} from '../../common/ui/buttons/button';
import {OBJ_DISPLAY_NAMES, ObjectName} from '../object-name';

export function ObjListPanel() {
  const objects = useStore(s => s.objects.all);
  const activeId = useStore(s => s.objects.active.id);

  return (
    <m.div
      {...PopoverAnimation}
      className={`absolute bottom-20 right-20 w-224 max-w-[calc(100%-40px)] max-h-[calc(100%-40px)] ${popoverStyle}`}
    >
      <div className="p-8 mb-4 bg-alt dark:bg-paper font-medium text-sm border-b flex items-center">
        <FormattedMessage defaultMessage="Objects" />
        <IconButton
          className="ml-auto flex-shrink-0"
          onPress={() => {
            state().togglePanel('objects', false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className="p-8">
        {objects.map(obj => {
          const isActive = obj.id === activeId;
          const objName = obj.name as Exclude<
            ObjectName,
            ObjectName.StraightenAnchor
          >;
          // @ts-ignore
          const displayName = OBJ_DISPLAY_NAMES[objName];
          const startIcon =
            displayName.icon &&
            React.createElement(displayName.icon, {className: 'icon-sm'});
          return (
            <Button
              onPress={() => {
                if (isActive || !obj.selectable) return;
                tools().objects.select(obj.id);
              }}
              variant="outline"
              color={isActive ? 'primary' : null}
              size="sm"
              className={clsx(
                'w-full mb-8',
                (isActive || !obj.selectable) && 'pointer-events-none'
              )}
              justify="justify-start"
              key={obj.id}
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
