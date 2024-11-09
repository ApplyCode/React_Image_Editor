import {fabric} from 'fabric';
import React, {useEffect, useState} from 'react';
import {TextField} from '../../common/ui/inputs/input-field/text-field';
import {state, tools} from '../../state/utils';
import {AnimatePresence, m} from 'framer-motion';
import {ToolName} from '../tool-name';
import InfiniteScroll from 'react-infinite-scroll-component';
import {IconButton} from '../../common/ui/buttons/icon-button';
import {ArrowBackIcon} from '../../common/icons/material/ArrowBack';
import { ActiveToolOverlay } from '../../state/editor-state';
const useDebounce = (value: string, delay: number = 750) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value]);
  return debouncedValue;
};

const PexelsImageSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const debouncedValue = useDebounce(searchTerm, 1000);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    setImages([]);
    setPage(1);
    getData();
  }, [debouncedValue]);
  const getData = async () => {
    console.log('getData');
    if (!debouncedValue) return;
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${debouncedValue}%20-lgbt%20-gay%20-nude%20-sex%20-kiss&20-ketut&per_page=50&page=${page}`,
      {
        headers: {
          Authorization:
            '563492ad6f91700001000001cdcba48e31d54c7983f88e65a692d1a6',
        },
      }
    );
    const data = await response.json();
    setImages(p => [...p, ...data.photos]);
    setHasMore(data.photos.length === 12);
    setPage(p => p + 1);
  };
  console.log(page, hasMore);
  return (
    <>
      <m.div
        initial={{
          opacity: 0,
        }}
        transition={{
          duration: 0.5,
          bounce: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        onClick={() => {
          state().setActiveTool(null, null);
        }}
        className="backdrop block fixed w-full h-full top-0 left-0 bg-black bg-opacity-10"
      />
      <m.div className="w-full cursor-default sm:max-w-288 tiny-scrollbar overflow-y-auto py-20 px-10 bg-white fixed z-10 h-screen max-h-[80vh] sm:max-h-screen sm:left-auto sm:right-0 top-0 left-0">
        <IconButton size="md" onPress={() => state().setActiveTool(null, null)}>
          <ArrowBackIcon />
        </IconButton>
        <h1 className="hidden sm:block">Pexels Image Search</h1>
        <TextField
          value={searchTerm}
          label="Search Image"
          onChange={e => setSearchTerm(e)}
        />
        <InfiniteScroll
          hasMore={hasMore}
          next={getData}
          scrollThreshold={0.8}
          dataLength={images.length + 2}
          hasChildren={true}
          loader={
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          }
          endMessage={
            <p className="text-center mt-5 font-monospace font-weight-bold">
              {images.length > 0 ? 'Yay! You have seen it all' : ''}
            </p>
          }
          className="mx-auto overflow-hidden h-full sm:block grid grid-cols-2 gap-10"
        >
          {images.map((image: any) => (
            <div
              title={image.alt}
              role="button"
              className="place-items-center col-span-1 cursor-pointer p-10 rounded-xl my-10 shadow-md"
              key={image.id}
              onClick={async () => {
                // state().setReplaced(true);
                const isImageToBeAdded = (window as any).isImageToBeAdded;

                if (isImageToBeAdded) {
                  tools().import.openOverlayImage(image.src.original + '?auto=compress&cs=tinysrgb&w=1000');
                } else {
                  state().toggleLoading('mainImage');
                  state().setActiveTool(null, null);
                  fabric.Image.fromURL(
                    image.src.original + '?auto=compress&cs=tinysrgb&w=1000',
                    tools().import.openBackgroundImage,
                    {
                      crossOrigin: 'anonymous',
                    }
                  );
                }
              }}
            >
              <div className="sm:px-0 px-30 text-center">
                <img
                  className="w-full mx-auto rounded-lg aspect-square object-contain max-w-[220px]"
                  src={image.src.medium}
                  alt={image.alt}
                />
              </div>
              <div className="col-span-3">
                <div className="text-xs w-full truncate">{image.alt}</div>
                <div className="text-xs text-primary">
                  By @{image.photographer}
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </m.div>
    </>
  );
};

export default PexelsImageSearch;
