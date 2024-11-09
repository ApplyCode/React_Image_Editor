import React, { forwardRef } from "react";

export interface SvgIconProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  color?: string;
  title?: string;
}

export const SvgIcon = forwardRef<SVGSVGElement, SvgIconProps & { attr?: {} }>(
  (props, ref) => {
    const {
      attr,
      size,
      title,
      className,
      color,
      style,
      children,
      ...svgProps
    } = props;
    const computedSize = size || "1em";
    let mergedClassName = "svg-icon";
    if (className) {
      mergedClassName += ` ${className}`;
    }

    return (
      <svg
        aria-hidden={!title}
        focusable={false}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        {...attr}
        {...svgProps}
        className={mergedClassName}
        style={{
          color,
          ...style,
        }}
        ref={ref}
        height={computedSize}
        width={computedSize}
      >
        {title && <title>{title}</title>}
        {children}
      </svg>
    );
  }
);
