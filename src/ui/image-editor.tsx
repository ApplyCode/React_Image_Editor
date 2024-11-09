import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {IntlProvider} from 'react-intl';
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  Variants,
} from 'framer-motion';
import {DropzoneOptions, useDropzone} from 'react-dropzone';
import clsx from 'clsx';
import {VisuallyHidden} from '@react-aria/visually-hidden';
import {useLayoutEffect} from '@react-aria/utils';
import {initTools} from '../tools/init-tools';
import {observeSize} from '../common/utils/dom/observe-size';
import {getBoundingClientRect} from '../common/utils/dom/get-bounding-client-rect';
import {initThemes, useActiveTheme} from '../utils/init-themes';
import {OverlayPositionContext} from '../common/ui/overlays/overlay-position-context';
import {ToolbarContainer} from './toolbar/toolbar-container';
import {LoadingIndicator} from './stage/loading-indicator';
import {CanvasWrapper} from './stage/canvas-wrapper';
import {
  getIsOverlayActive,
  ToolControlsOverlay,
} from './navbar/tool-controls-overlay';
import {Navbar} from './navbar/navbar';
import {OverlayPanelContainer} from './overlay-panel-container';
import {useStore} from '../state/store';
import {ToastContainer} from '../common/ui/toast/toast-container';
import {state, tools} from '../state/utils';
import {UploadedFile} from '../common/uploads/uploaded-file';
import {imgContentTypes, stateContentType} from '../tools/import/import-tool';
import {buildUploadInputAccept} from '../common/uploads/utils/create-upload-input';
import {handleCanvasKeydown} from './handle-canvas-keydown';
import {IconButton} from '../common/ui/buttons/icon-button';
import {CloseIcon} from '../common/icons/material/Close';
import {Underlay} from '../common/ui/overlays/modal/underlay';
import {useEditorMode} from './editor-mode';
import {NavPosition} from './navbar/nav-position';
import {ToolControls} from './navbar/tool-controls';
import {useMediaQuery} from '../common/utils/hooks/use-media-query';
import TemplateOverlay from '../tools/templates/ui/template-overlay';
import {ToolName} from '../tools/tool-name';
import { loadFonts } from '../common/ui/font-picker/load-fonts';

export function ImageEditor() {
  const activeLang = useStore(s => s.config.activeLanguage) || 'en';
  const languages = useStore(s => s.config.languages);
  const isVisible = useStore(s => s.config.ui?.visible) ?? true;
  const navPosition = useStore(s => s.config.ui?.nav?.position) ?? 'bottom';
  const menuPosition = useStore(s => s.config.ui?.menubar?.position) ?? 'top';
  const allowEditorClose = useStore(s => s.config.ui?.allowEditorClose) ?? true;
  const activeOverlay = useStore(s => s.activeToolOverlay);
  const activeObjId = useStore(s => s.objects.active.id);
  const messages = languages?.[activeLang] || {};
  const activeTheme = useActiveTheme();
  const rootEl = useRef<HTMLDivElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const {isModal, isMobile} = useEditorMode();
  const showCloseIcon = isModal && isVisible && !isMobile && allowEditorClose;
  const showUnderlay = isModal && isVisible;
  const activeTool = useStore(s => s.activeTool);
  const isLarge = useMediaQuery('(min-width: 640px)');
  const panContainerRef = useRef<HTMLDivElement>(null!);

  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const fonts = useStore(s => s.config.tools?.text?.items);

  // load fonts into dom
  useEffect(() => {
    fontsLoaderHandler();
  }, [fonts]);

  const fontsLoaderHandler = async () => {
    setFontsLoaded(false);
    if (fonts) {
      await loadFonts(fonts);
    }
    setFontsLoaded(true);
  }

  const onDrop: DropzoneOptions['onDrop'] = useCallback(files => {
    if (state().activeTool || state().dirty || !files.length) return;
    const uploadedFile = new UploadedFile(files[0]);
    if (state().config.tools?.import?.openDroppedImageAsBackground ?? false) {
      tools().import.openBackgroundImage(uploadedFile);
    } else {
      tools().import.openUploadedFile(uploadedFile);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    rootRef: stageRef,
  } = useDropzone({
    onDrop,
    accept: buildUploadInputAccept({...imgContentTypes(), ...stateContentType}),
  });

  useEffect(() => {
    // editor already booted
    if (state().fabric) return;

    initTools(canvasRef.current);

    if (state().config.ui?.defaultTool) {
      state().setActiveTool(state().config.ui?.defaultTool!, null);
    }

    tools()
      .canvas.loadInitialContent()
      .then(() => {
        state().config.onLoad?.(state().editor);
      });

    const unobserveStage = observeSize(panContainerRef.current!, () => {
      state().setStageSize(getBoundingClientRect(panContainerRef.current!));
    });
    const unobserveCanvas = observeSize(canvasRef.current, () => {
      state().setCanvasSize(getBoundingClientRect(canvasRef.current));
    });
    return () => {
      unobserveStage();
      unobserveCanvas();
    };
  }, [panContainerRef]);
  const dimensions = useStore(s => s.original);
  // make sure css variables are added before editor ui is rendered
  useLayoutEffect(() => {
    initThemes(rootEl.current, activeTheme);
  }, [activeTheme]);
  useLayoutEffect(() => {
    if (activeTool) {
      tools().zoom.fitToScreen();
    }
  }, [dimensions, activeTool]);
  const variants: Variants = {
    visible: {
      opacity: 1,
      scale: 1,
      display: 'flex',
    },
    hidden: {opacity: 0, transitionEnd: {display: 'none'}},
  };

  const rootClassName = clsx(
    'pixie-root flex flex-col bg-background text-main no-tap-highlight w-full h-full',
    {
      relative: !isModal,
      'fixed inset-0 w-full h-full z-20': isModal,
      'shadow-lg border _off_rounded-md m-auto _off_max-h-[calc(100vh-90px)] _off_max-w-[calc(100vw-90px)]':
        isModal && !isMobile,
    }
  );

  return (
    <LazyMotion features={domAnimation} strict>
      {showCloseIcon && (
        <IconButton
          className="z-20 fixed right-2 top-2 text-white"
          size="lg"
          onPress={() => {
            state().editor.close();
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
      {showUnderlay && <Underlay position="fixed" disableInitialTransition />}
      <m.div
        ref={rootEl}
        initial={false}
        variants={variants}
        animate={(isVisible) ? 'visible' : 'hidden'}
        className={rootClassName}
      >
        <OverlayPositionContext.Provider
          value={{
            boundary: rootEl,
            portalContainer: rootEl,
            shouldFlip: false,
            placement: navPosition === 'bottom' ? 'top' : 'bottom',
            maxHeight: '400px',
          }}
        >
          <IntlProvider
            locale={activeLang}
            defaultLocale="en"
            messages={messages}
          >
            <div className="flex h-screen sm:flex-row w-screen overflow-hidden flex-col">
              {navPosition === NavPosition.LEFT && <Navbar />}
              <div
                className="flex flex-col h-full w-full"
                style={{
                  maxWidth: isLarge ? 'calc(100% - 86px)' : '100%',
                }}
              >
                {menuPosition === 'top' && <ToolbarContainer />}
                <main
                  className="relative flex flex-auto overflow-hidden outline-none"
                  {...getRootProps({
                    onKeyDownCapture: handleCanvasKeydown,
                  })}
                >
                  <div className="flex flex-col w-full h-full">
                    <VisuallyHidden>
                      <input {...getInputProps} />
                    </VisuallyHidden>
                    <LoadingIndicator />
                    <div className="h-full flex">
                      <AnimatePresence initial={false}>
                        <m.div
                          className="flex flex-col"
                          // style={{
                          //   width:
                          //     isLarge &&
                          //     getIsOverlayActive(activeOverlay, activeObjId)
                          //       ? 'calc(100% - 230px)'
                          //       : '100%',
                          // }}
                          initial={{
                            width: '100%',
                          }}
                          animate={{
                            width:
                              isLarge &&
                              getIsOverlayActive(activeOverlay, activeObjId)
                                ? 'calc(100% - 230px)'
                                : '100%',
                          }}
                          exit={{
                            width: '100%',
                          }}
                          transition={{
                            type: 'tween',
                            duration: 0.2,
                          }}
                        >
                          <CanvasWrapper
                            panContainerRef={panContainerRef}
                            ref={canvasRef}
                          />

                          <AnimatePresence initial={false}>
                            {isLarge && activeTool && (
                              <ToolControls
                                key="tool-controls"
                              />
                            )}
                          </AnimatePresence>
                        </m.div>
                      </AnimatePresence>
                      {isLarge && <ToolControlsOverlay />}
                    </div>
                  </div>
                </main>
                {menuPosition === 'bottom' && <ToolbarContainer />}
              </div>
              {navPosition === NavPosition.RIGHT && <Navbar />}
              <AnimatePresence initial={false}>
                {!isLarge && <ToolControlsOverlay />}
                {!isLarge && activeTool === ToolName.TEMPLATE && (
                  <TemplateOverlay />
                )}
              </AnimatePresence>
              <OverlayPanelContainer />
              <ToastContainer />
            </div>
          </IntlProvider>
        </OverlayPositionContext.Provider>
      </m.div>
    </LazyMotion>
  );
}
