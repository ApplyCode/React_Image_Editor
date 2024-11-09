import React, {useEffect, useState} from 'react';
import {AnimatePresence, m} from 'framer-motion';
import {defineMessages, FormattedMessage} from 'react-intl';
import {useStore} from '../../state/store';
import {LoadingType} from '../../state/editor-state';

const messages = defineMessages({
  newCanvas: {defaultMessage: 'Loading Canvas'},
  mainImage: {defaultMessage: 'Loading Image'},
  state: {defaultMessage: 'Loading State'},
  merge: {defaultMessage: 'Processing Image'},
});

export function LoadingIndicator() {
  const [activeLoadState, setActiveLoadState] =
    useState<LoadingType | false>(false);

  useEffect(() => {
    useStore.subscribe(
      s => s.loading,
      loadState => {
        if (loadState) {
          setActiveLoadState(loadState);
        }
      }
    );
  }, []);

  return (
    <AnimatePresence>
      {activeLoadState && (
        <m.div
          initial={{y: '60%', opacity: 0}}
          animate={{y: 0, opacity: 1}}
          exit={{y: '-60%', opacity: 0}}
          transition={{type: 'tween', duration: 0.3}}
          onAnimationComplete={() => {
            setTimeout(() => {
              setActiveLoadState(false);
            }, 400);
          }}
          className="absolute z-loading-indicator inset-0 m-auto p-6 w-144 h-32 text-center text-sm bg-paper rounded-full shadow-lg"
        >
          <FormattedMessage {...messages[activeLoadState]} />
        </m.div>
      )}
    </AnimatePresence>
  );
}
