import React from 'react';
import {m} from 'framer-motion';
import {ToolName} from '../../tools/tool-name';
import {FilterNav} from '../../tools/filter/ui/filter-nav';
import {ShapeNav} from '../../tools/shapes/ui/shape-nav';
import {StickerNav} from '../../tools/shapes/ui/sticker-nav/sticker-nav';
import {FrameNav} from '../../tools/frame/ui/frame-nav';
import {TextNav} from '../../tools/text/ui/text-nav';
import {DrawNav} from '../../tools/draw/ui/draw-nav';
import {CornersNav} from '../../tools/corners/ui/corners-nav';
import {navbarAnimation} from './navbar-animation';
import BackGroundNav from '../../tools/background/ui/background-nav';
import ImageNav from '../../tools/add_image/ui/image-nav';
import {useMediaQuery} from '../../common/utils/hooks/use-media-query';
import TemplateOverlay from '../../tools/templates/ui/template-overlay';
import {useStore} from '../../state/store';

// type Props = {
//   activeTool: ToolName | null;
// };

export function ToolControls() {
  const activeTool = useStore(s => s.activeTool);
  const toolNav = getToolNav(activeTool);
  const isLarge = useMediaQuery('(min-width: 640px)');

  return (
    <>
      {ToolName.TEMPLATE !== activeTool ? (
        <m.div
          className="relative px-10 max-w-full sm:w-auto w-full h-full sm:h-128 flex items-center text-sm bg select-none overflow-hidden"
          {...(isLarge ? navbarAnimation : {})}
        >
          {toolNav}
        </m.div>
      ) : isLarge ? (
          <TemplateOverlay />
      ) : (
        <div className="relative px-10 max-w-full h-full sm:h-110 flex items-center text-sm bg select-none overflow-hidden" />
      )}
    </>
  );
}

function getToolNav(activeTool: ToolName | null) {
  switch (activeTool) {
    case ToolName.FILTER:
      return <FilterNav />;
    case ToolName.DRAW:
      return <DrawNav />;
    case ToolName.TEXT:
      return <TextNav />;
    case ToolName.SHAPES:
      return <ShapeNav />;
    case ToolName.STICKERS:
      return <StickerNav />;
    case ToolName.FRAME:
      return <FrameNav />;
    case ToolName.CORNERS:
      return <CornersNav />;
    case ToolName.CHANGE_IMAGE:
      return <BackGroundNav />;
    case ToolName.ADD_IMAGE:
      return <ImageNav />;
    default:
      return null;
  }
}
