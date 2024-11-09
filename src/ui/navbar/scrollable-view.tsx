import React, {forwardRef} from 'react';
import clsx from 'clsx';

type ScrollableListProps = {
  children: React.ReactNode;
  className?: string;
  gap?: string;
  isHorizontal?: boolean;
};

export const ScrollableView = forwardRef<HTMLDivElement, ScrollableListProps>(
  ({children, className, gap, isHorizontal}, ref) => {
    const extendedChildren = React.Children.map(children, (child, i) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          // @ts-ignore
          isFirst: isHorizontal && i === 0,
          isLast: isHorizontal && React.Children.count(children) === i + 1,
        });
      }
      return child;
    });
    return (
      <div
        ref={ref}
        className={`tiny-scrollbar pb-4 overflow-y-auto max-h-screen flex-wrap relative flex items-center ${
          gap || 'gap-10'
        } ${className}`}
      >
        {extendedChildren}
      </div>
    );
  }
);

type ScrollableListItemProps = {
  children: React.ReactNode;
  className?: string;
  isFirst?: boolean;
  isLast?: boolean;
};

export function ScrollableViewItem({
  isFirst,
  isLast,
  children,
  className,
}: ScrollableListItemProps) {
  const mergedClass = clsx(className, 'flex-shrink-0', {
    'ml-auto': isFirst,
    'mr-auto': isLast,
  });
  return <div className={mergedClass}>{children}</div>;
}
