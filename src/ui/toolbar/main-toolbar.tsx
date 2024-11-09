import {m} from 'framer-motion';
import React from 'react';
import {useStore} from '../../state/store';
import {toolbarAnimation, toolbarStyle} from './toolbar-style';
import {ToolbarItemConfig} from '../../config/default-config';
import {ToolbarItem} from './toolbar-item/toolbar-item';
import {IconButton} from '../../common/ui/buttons/icon-button';
import {state} from '../../state/utils';
import {CloseIcon} from '../../common/icons/material/Close';
import {useEditorMode} from '../editor-mode';

export function MainToolbar() {
  const {isModal, isMobile} = useEditorMode();
  const allowEditorClose = useStore(s => s.config.ui?.allowEditorClose) ?? true;
  const items = useStore(s => s.config.ui?.menubar?.items) || [];
  const leftItems: ToolbarItemConfig[] = [];
  const centerItems: ToolbarItemConfig[] = [];
  const rightItems: ToolbarItemConfig[] = [];

  items
    .filter(
      item => (!isMobile && !item.mobileOnly) || (isMobile && !item.desktopOnly)
    )
    .forEach(item => {
      if (item.align === 'left') {
        leftItems.push(item);
      } else if (item.align === 'right') {
        rightItems.push(item);
      } else {
        centerItems.push(item);
      }
    });

  const closeButton = isModal && isMobile && allowEditorClose && (
    <IconButton
      size="sm"
      className="ml-10"
      onPress={() => {
        state().editor.close();
      }}
    >
      <CloseIcon />
    </IconButton>
  );

  return (
    <m.div className={toolbarStyle} {...toolbarAnimation}>
      <div className="mr-auto">
        {leftItems.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <ToolbarItem item={item} key={i} />
        ))}
      </div>
      <div className="flex items-center gap-10">
        {centerItems.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <ToolbarItem item={item} key={i} />
        ))}
      </div>
      <div className="ml-auto flex items-center gap-8">
        {rightItems.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <ToolbarItem item={item} key={i} />
        ))}
      </div>
      {/* {closeButton} */}
    </m.div>
  );
}
