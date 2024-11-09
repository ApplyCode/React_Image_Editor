import {AnimatePresence, m} from 'framer-motion';
import {FilterControls} from '../../tools/filter/ui/filter-controls';
import {useStore} from '../../state/store';
import {ActiveFrameControls} from '../../tools/frame/ui/active-frame-controls';
import {ActiveTextControls} from '../../tools/text/ui/active-text-controls';
import {ActiveObjectControls} from '../../objects/ui/active-obj-controls/active-object-controls';
import {ActiveToolOverlay} from '../../state/editor-state';
import PexelsImageSearch from '../../tools/background/search-pexels';
import {ResizeNav} from '../../tools/resize/ui/resize-nav';
import {CropNav} from '../../tools/crop/ui/crop-nav/crop-nav';
import {useMediaQuery} from '../../common/utils/hooks/use-media-query';

export function ToolControlsOverlay() {
  const activeOverlay = useStore(s => s.activeToolOverlay);
  const activeObjId = useStore(s => s.objects.active.id);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const overlayCmp = getOverlay(activeOverlay, activeObjId);
  const animations = isMobile
    ? {
        initial: {y: '100%', opacity: 0},
        animate: {y: 0, opacity: 1},
        exit: {y: '100%', opacity: 0},
        className: 'gap-16 pr-5vw pl-[10vw] bg bg-opacity-95 border-t',
      }
    : {
        initial: {width: 0, opacity: 0},
        animate: {width: 230, opacity: 1},
        exit: {width: 0, opacity: 0},
        className:
          'gap-16 bg flex-col overflow-y-auto p-10 tiny-scrollbar h-full flex bg-opacity-95',
      };
  return (
    <div
      className={`relative z-tool-overlay text-sm ${
        isMobile ? '' : 'border-l pr-2 h-full flex'
      }`}
    >
      <AnimatePresence>
        {activeOverlay === ActiveToolOverlay.ChangeImage ? (
          <PexelsImageSearch />
        ) : (
          overlayCmp && (
            <m.div {...animations} key="tool-controls-overlay">
              {overlayCmp}
            </m.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}

function getOverlay(
  activeOverlay: ActiveToolOverlay | null,
  activeObjId: string | null
) {
  switch (activeOverlay) {
    case ActiveToolOverlay.Filter:
      return <FilterControls />;
    case ActiveToolOverlay.Frame:
      return <ActiveFrameControls />;
    case ActiveToolOverlay.Text:
      return activeObjId && <ActiveTextControls />;
    case ActiveToolOverlay.ActiveObject:
      return activeObjId && <ActiveObjectControls />;
    case ActiveToolOverlay.Resize:
      return <ResizeNav />;
    case ActiveToolOverlay.Crop:
      return <CropNav />;
    default:
      return null;
  }
}

export const getIsOverlayActive = (
  activeOverlay: ActiveToolOverlay | null,
  activeObjId: string | null
) => {
  switch (activeOverlay) {
    case ActiveToolOverlay.Filter:
      return true;
    case ActiveToolOverlay.Frame:
      return true;
    case ActiveToolOverlay.Text:
      return !!activeObjId;
    case ActiveToolOverlay.ChangeImage:
      return true;
    case ActiveToolOverlay.Resize:
      return true;
    case ActiveToolOverlay.Crop:
      return true;
    case ActiveToolOverlay.ActiveObject:
      return !!activeObjId;
    default:
      return false;
  }
};
