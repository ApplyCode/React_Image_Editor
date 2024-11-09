import {AnimatePresence, m} from 'framer-motion';
import React, {useState, useEffect} from 'react';
import {FormattedMessage} from 'react-intl';
import {useStore} from '../../state/store';
import {NavItem} from '../../config/default-config';
import {setActiveTool} from './set-active-tool';
import {ToolControls} from './tool-controls';
import {ButtonBase} from '../../common/ui/buttons/button-base';
import {navItemMessages} from '../../config/default-nav-items';
import {state, tools} from '../../state/utils';
import {ScrollableView, ScrollableViewItem} from './scrollable-view';
import {MixedIcon} from '../mixed-icon';
import {useMediaQuery} from '../../common/utils/hooks/use-media-query';
import {AddIcon} from '../../common/icons/material/Add';
import {ToolName} from '../../tools/tool-name';
import {getIsOverlayActive} from './tool-controls-overlay';

export function Navbar() {
  return (
    <nav className="z-navbar sm:flex border-t bg-[#f9f9f9] sm:h-screen flex-shrink-0 relative">
      <NavItems key="nav-items" />
    </nav>
  );
}

function NavItems() {
  const navItems = useStore(s => s.config.ui?.nav?.items) || [];
  const isLarge = useMediaQuery('(min-width: 640px)');
  const activeTool = useStore(s => s.activeTool);
  const activeOverlay = useStore(s => s.activeToolOverlay);
  const activeObjId = useStore(s => s.objects.active.id);
  const open = useStore(s => s.bottomNav);
  useEffect(() => {
    if (activeOverlay && activeTool !== ToolName.TEXT && !isLarge) {
      state().setBottomNav(false);
    }
  }, [activeOverlay]);
  useEffect(() => {
    if (isLarge) {
      state().setBottomNav(true);
    } else {
      if (open && !activeTool) {
        state().setActiveTool(ToolName.CHANGE_IMAGE, null);
      }
    }
  }, [isLarge, open, activeTool]);
  return (
    <>
      {!isLarge && !getIsOverlayActive(activeOverlay, activeObjId) && (
        <div
          onClick={() => {
            state().setBottomNav(!open);
          }}
          className="fixed bottom-20 bg-[#2998ff] left-20 h-40 w-40 rounded-full flex justify-center items-center shadow-sm"
        >
          <AddIcon className="text-white" />
        </div>
      )}
      <AnimatePresence>
        {open && (
          <>
            <m.div
              initial={{
                opacity: 0,
              }}
              transition={{
                duration: 0.5,
                bounce: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() => state().setBottomNav(false)}
              className="backdrop sm:hidden block sm:static fixed w-full h-full top-0 left-0 bg-black bg-opacity-10"
            />
            <m.div
              initial={{
                y: '100%',
                scale: 0.8,
              }}
              animate={{
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.7,
                bounce: 0,
              }}
              exit={{
                y: '100%',
                scale: 0.8,
              }}
              className="sm:w-86 overflow-hidden outer sm:rounded-tl-none flex-col sm:rounded-tr-none rounded-tl-[50px] rounded-tr-[50px] w-full pb-20 sm:pb-0 flex items-end bottom-0 sm:px-0 px-10 bg-white sm:h-screen h-[250px] sm:relative fixed"
            >
              {!isLarge && activeTool && (
                <ToolControls key="tool-controls" activeTool={activeTool} />
              )}
              <ScrollableView
                isHorizontal
                className="sm:py-10 py-20 w-full overflow-y-hidden sm:overflow-y-auto sm:flex-col flex-nowrap"
              >
                {navItems.map(item => (
                  <ScrollableViewItem
                    className="sm:mx-auto sm:w-full w-86"
                    key={item.name}
                  >
                    <ToolButton item={item} />
                  </ScrollableViewItem>
                ))}
              </ScrollableView>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

type ToolButtonProps = {
  item: NavItem;
};

function ToolButton({item}: ToolButtonProps) {
  const clickHandler = async () => {
    // if (state().activeTool === ToolName.DRAW) {
    //   tools().draw.disable();
    // }
    await state()[state().activeTool ? 'cancelChanges' : 'applyChanges']();
    if (typeof item.action === 'string') {
      if (item.name === ToolName.TEMPLATE) state().setBottomNav(false);
      setActiveTool(item.action);
    } else if (typeof item.action === 'function') {
      item.action(state);
    }
  };
  const msg = navItemMessages[item.name];
  return (
    <ButtonBase
      variant="outline"
      color="paper"
      className="flex-col bg-[#f9f9f9] flex-shrink-0 border-0 w-full max-w-86 h-70"
      radius="rounded-2xl"
      onPress={clickHandler}
    >
      <div className="mb-1">
        <MixedIcon className="icon-md" icon={item.icon} />
      </div>
      <div className="mt-6 text-xs capitalize whi">
        {msg ? <FormattedMessage {...msg} /> : item.name}
      </div>
    </ButtonBase>
  );
}
