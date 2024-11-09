import React from 'react';
import {CropIcon} from '../../../common/icons/material/Crop';
import {ImageIcon} from '../../../common/icons/material/Image';
import {PagesIcon} from '../../../common/icons/material/Pages';
import {PhotoCameraIcon} from '../../../common/icons/material/PhotoCamera';
import {PhotoSizeSelectLargeIcon} from '../../../common/icons/material/PhotoSizeSelectLarge';
import {SearchIcon} from '../../../common/icons/material/Search';
import {ActiveToolOverlay} from '../../../state/editor-state';
import {state, tools} from '../../../state/utils';
import {
  ScrollableView,
  ScrollableViewItem,
} from '../../../ui/navbar/scrollable-view';
import {setActiveTool} from '../../../ui/navbar/set-active-tool';
import {ToolName} from '../../tool-name';

const BackGroundNav = () => {
  return (
    <ScrollableView className="flex-nowrap">
      {/* <h1>BackGroundNav</h1> */}
      <ScrollableViewItem>
        <div
          className="h-70 cursor-pointer w-86 flex px-10 justify-center items-center flex-col border rounded-xl"
          onClick={() => {
            (window as any).isImageToBeAdded = false;

            if (state().activeToolOverlay !== ActiveToolOverlay.ChangeImage) {
              state().setActiveTool(
                ToolName.CHANGE_IMAGE,
                ActiveToolOverlay.ChangeImage
              );
            } else {
              state().setActiveTool(ToolName.CHANGE_IMAGE, null);
            }
          }}
        >
          <div className="mb-1">
            <SearchIcon className="text-2xl" />
          </div>
          <div className="text-xs whitespace-nowrap">Search Images</div>
        </div>
      </ScrollableViewItem>
      <ScrollableViewItem>
        <div
          className="h-70 w-86 flex px-10 cursor-pointer justify-center items-center flex-col border rounded-xl"
          onClick={() => {
            state().setReplaced(false);
            tools().import.uploadAndReplaceMainImage();
          }}
        >
          <div className="mb-1">
            <PhotoCameraIcon className="text-2xl" />
          </div>
          <div className="text-xs whitespace-nowrap">New Image</div>
        </div>
      </ScrollableViewItem>
      {/* <ScrollableViewItem>
        <div
          className="h-70 w-86 flex px-10 cursor-pointer justify-center items-center flex-col border rounded-xl"
          onClick={() => {
            state().setReplaced(true);
            tools().import.uploadAndReplaceMainImage();
          }}
        >
          <div className="mb-1">
            <ImageIcon className="text-2xl" />
          </div>
          <div className="text-xs whitespace-nowrap">Replace Image</div>
        </div>
      </ScrollableViewItem>
      <ScrollableViewItem>
        <div
          className="h-70 flex w-86 px-10 cursor-pointer justify-center items-center flex-col border rounded-xl"
          onClick={() => {
            state().setReplaced(true);
            state().togglePanel('newImage', true);
            state().setPanel('newCanvas');
          }}
        >
          <div className="mb-1">
            <PagesIcon className="text-2xl" />
          </div>
          <div className="text-xs whitespace-nowrap">Create New</div>
        </div>
      </ScrollableViewItem>
      <ScrollableViewItem>
        <div
          className="h-70 flex w-86 px-10 cursor-pointer justify-center items-center flex-col border rounded-xl"
          onClick={() => {
            state().setActiveTool(
              ToolName.CHANGE_IMAGE,
              ActiveToolOverlay.Resize
            );
          }}
        >
          <div className="mb-1">
            <PhotoSizeSelectLargeIcon className="text-2xl" />
          </div>
          <div className="text-xs whitespace-nowrap">Resize</div>
        </div>
      </ScrollableViewItem>
      <ScrollableViewItem>
        <div
          className="h-70 flex w-86 px-10 cursor-pointer justify-center items-center flex-col border rounded-xl"
          onClick={() => {
            state().setActiveTool(
              ToolName.CHANGE_IMAGE,
              ActiveToolOverlay.Crop
            );
          }}
        >
          <div className="mb-1">
            <CropIcon className="text-2xl" />
          </div>
          <div className="text-xs whitespace-nowrap">Crop</div>
        </div>
      </ScrollableViewItem> */}
    </ScrollableView>
  );
};

export default BackGroundNav;
