import React, {useCallback, useEffect, useRef} from 'react';
import {useVirtual} from 'react-virtual';
import clsx from 'clsx';
import {StickerCategory} from '../../../../config/default-stickers';
import {stickerUrl} from '../../shape-tool';
import {Button} from '../../../../common/ui/buttons/button';
import {state, tools} from '../../../../state/utils';
import {useActiveTheme} from '../../../../utils/init-themes';

type Props = {
  category: StickerCategory;
};

export function StickerList({category}: Props) {
  const activeTheme = useActiveTheme();
  const name = category.name;
  const iterable = category.list
    ? category.list
    : Array.from(Array(category.items).keys());

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtual({
    horizontal: true,
    size: iterable.length,
    parentRef,
    estimateSize: useCallback(() => 52, []),
    overscan: 5,
  });

  useEffect(() => {
    virtualizer.scrollToIndex(0);
    // don't add virtualizer to deps, otherwise there will be infinite rerender
    // eslint-disable-next-line
  }, [name]);

  return (
    <>
      <div
        ref={parentRef}
        className="tiny-scrollbar overflow-x-auto overflow-y-hidden"
        style={{height: `52px`}}
      >
        <div
          className="h-full relative mx-auto"
          style={{width: `${virtualizer.totalSize}px`}}
        >
          {virtualizer.virtualItems.map(virtualColumn => {
            const stickerName = `${iterable[virtualColumn.index]}`;
            return (
              <div
                key={virtualColumn.index}
                className="absolute top-0 left-0 h-full"
                style={{
                  width: `${virtualColumn.size}px`,
                  transform: `translateX(${virtualColumn.start}px)`,
                }}
              >
                <Button
                  variant="outline"
                  radius="rounded-xl"
                  size="md"
                  equalWidth
                  onPress={async () => {
                    await tools().shape.addSticker(category.name, stickerName);
                    await state().saveChanges();
                  }}
                >
                  <img
                    className={clsx(
                      'm-auto w-28 h-28',
                      category.invertPreview && activeTheme?.isDark && 'invert'
                    )}
                    src={stickerUrl(category, stickerName)}
                    alt={stickerName}
                  />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
