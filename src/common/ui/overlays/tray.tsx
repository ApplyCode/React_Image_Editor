import React, {
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import {OverlayProps} from '@react-types/overlays';
import {m} from 'framer-motion';
import {mergeProps, useViewportSize} from '@react-aria/utils';
import {useModal, useOverlay, usePreventScroll} from '@react-aria/overlays';
import {Underlay} from './modal/underlay';
import {Overlay} from './overlay';

export interface TrayProps extends OverlayProps {
  children: ReactElement;
  isOpen?: boolean;
  onClose?: () => void;
  shouldCloseOnBlur?: boolean;
  isFixedHeight?: boolean;
  isNonModal?: boolean;
}

export function Tray(props: TrayProps) {
  const {children, isOpen, onClose, isFixedHeight, isNonModal, ...otherProps} =
    props;
  const domRef = useRef<HTMLDivElement>(null);

  const {overlayProps, underlayProps} = useOverlay(
    {...props, isDismissable: true},
    domRef
  );

  return (
    <Overlay type="tray" {...otherProps}>
      <Underlay {...underlayProps} />
      <TrayWrapper
        onClose={onClose}
        ref={domRef}
        overlayProps={overlayProps}
        isFixedHeight={isFixedHeight}
        isNonModal={isNonModal}
      >
        {children}
      </TrayWrapper>
    </Overlay>
  );
}

interface TrayWrapperProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  isFixedHeight?: boolean;
  isNonModal?: boolean;
  overlayProps: HTMLAttributes<HTMLElement>;
}

const TrayWrapper = forwardRef(
  (props: TrayWrapperProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      children,
      isOpen,
      isFixedHeight,
      isNonModal,
      overlayProps,
      ...otherProps
    } = props;
    usePreventScroll();
    const {modalProps} = useModal({
      isDisabled: isNonModal,
    });

    // We need to measure the window's height in JS rather than using percentages in CSS
    // so that contents (e.g. menu) can inherit the max-height properly. Using percentages
    // does not work properly because there is nothing to base the percentage on.
    // We cannot use vh units because mobile browsers adjust the window height dynamically
    // when the address bar/bottom toolbars show and hide on scroll and vh units are fixed.
    // Also, the visual viewport is smaller than the layout viewport when the virtual keyboard
    // is up, so use the VisualViewport API to ensure the tray is displayed above the keyboard.
    const viewport = useViewportSize();
    const [height, setHeight] = useState(viewport.height);
    const timeoutRef = useRef<any>();

    useEffect(() => {
      clearTimeout(timeoutRef.current);

      // When the height is decreasing, and the keyboard is visible
      // (visual viewport smaller than layout viewport), delay setting
      // the new max height until after the animation is complete
      // so that there isn't an empty space under the tray briefly.
      if (viewport.height < height && viewport.height < window.innerHeight) {
        timeoutRef.current = setTimeout(() => {
          setHeight(viewport.height);
        }, 500);
      } else {
        setHeight(viewport.height);
      }
    }, [height, viewport.height]);

    const style: React.CSSProperties = {
      maxHeight: `${viewport.height - 64}px`,
    };
    const domProps = mergeProps(otherProps, overlayProps, {style});

    return (
      <m.div
        initial={{opacity: 0, y: '100%'}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: '100%'}}
        transition={{type: 'tween', duration: 0.2}}
        className="absolute bottom-0 left-0 w-full z-20"
      >
        <div
          {...domProps}
          {...modalProps}
          className="max-w-375 w-full pb-safe-area mx-auto bg-paper rounded shadow-lg"
          ref={ref}
        >
          {children}
        </div>
      </m.div>
    );
  }
);
