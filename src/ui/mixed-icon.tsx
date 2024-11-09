import React, {ComponentType, ReactElement, SVGProps} from 'react';
import clsx from 'clsx';
import {createSvgIconFromTree, IconTree} from '../common/icons/create-svg-icon';

interface MixedIconProps {
  icon: ReactElement<{className: string}> | IconTree[] | string | ComponentType;
  className?: string;
}
function _MixedIcon({icon, className}: MixedIconProps) {
  let iconEl: ReactElement;
  // Regular JSX element
  if (React.isValidElement(icon)) {
    iconEl = React.cloneElement(icon, {
      className: 'svg-iconEl',
    });

    // url for external icon
  } else if (typeof icon === 'string') {
    iconEl = <img className="w-font h-font" src={icon} alt="" />;

    // Icon tree object
  } else if (Array.isArray(icon)) {
    iconEl = React.createElement(createSvgIconFromTree(icon));

    // Component type
  } else {
    iconEl = React.createElement<SVGProps<SVGSVGElement>>(icon);
  }
  return <span className={clsx(className, 'leading-none')}>{iconEl}</span>;
}

export const MixedIcon = React.memo(_MixedIcon);
