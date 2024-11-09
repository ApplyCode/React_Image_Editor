import {toast, useToaster} from 'react-hot-toast';
import {AnimatePresence, m} from 'framer-motion';
import React from 'react';
import {FormattedMessage, MessageDescriptor} from 'react-intl';
import {IconButton} from '../buttons/icon-button';
import {CloseIcon} from '../../icons/material/Close';
import {ErrorOutlineIcon} from '../../icons/material/ErrorOutline';

export function ToastContainer() {
  const {toasts, handlers} = useToaster({
    position: 'bottom-center',
  });
  const {startPause, endPause} = handlers;
  return (
    <div
      className="absolute bottom-10 left-0 right-0 z-toast m-auto px-10"
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      <AnimatePresence initial={false}>
        {toasts
          .filter(t => t.visible)
          .map(t => {
            return (
              <m.div
                initial={{opacity: 0, y: 50, scale: 0.3}}
                animate={{opacity: 1, y: 0, scale: 1}}
                exit={{opacity: 0, scale: 0.5, transition: {duration: 0.2}}}
                className="relative my-8 mx-auto h-[46px] flex items-center shadow-lg text-base w-min whitespace-nowrap bg-error text-on-error rounded-lg p-10"
                key={t.id}
                {...t.ariaProps}
              >
                {t.type === 'error' && (
                  <ErrorOutlineIcon className="svg-icon mr-12 icon-md" />
                )}
                {typeof t.message === 'string' ? (
                  t.message
                ) : (
                  <FormattedMessage {...(t.message as MessageDescriptor)} />
                )}
                <IconButton
                  onPress={() => {
                    toast.dismiss(t.id);
                  }}
                  size="sm"
                  className="ml-12"
                >
                  <CloseIcon />
                </IconButton>
              </m.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}
