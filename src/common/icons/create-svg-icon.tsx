import React, {ComponentType, ReactElement, RefObject} from 'react';
import {SvgIcon, SvgIconProps} from './svg-icon';

export function createSvgIcon(
  path: ReactElement | ReactElement[],
  displayName: string = ''
): ComponentType<SvgIconProps> {
  const Component = (props: SvgIconProps, ref: RefObject<SVGSVGElement>) => (
    <SvgIcon data-testid={`${displayName}Icon`} ref={ref} {...props}>
      {path}
    </SvgIcon>
  );

  if (process.env.NODE_ENV !== 'production') {
    // Need to set `displayName` on the inner component for React.memo.
    // React prior to 16.14 ignores `displayName` on the wrapper.
    Component.displayName = `${displayName}Icon`;
  }

  return React.memo(React.forwardRef(Component as any));
}

export interface IconTree {
  tag: string;
  attr?: {[key: string]: string};
  child?: IconTree[];
}
export function createSvgIconFromTree(
  data: IconTree[],
  displayName: string = ''
) {
  const path = Tree2Element(data);
  return createSvgIcon(path!, displayName);
}

function Tree2Element(tree?: IconTree[]): React.ReactElement<{}>[] | undefined {
  return (
    tree &&
    tree.map((node, i) => {
      return React.createElement(
        node.tag,
        // eslint-disable-next-line react/no-array-index-key
        {key: i, ...node.attr},
        Tree2Element(node.child)
      );
    })
  );
}
