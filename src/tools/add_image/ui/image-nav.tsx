import React from 'react';
import {FileUploadIcon} from '../../../common/icons/material/FileUpload';
import {state, tools} from '../../../state/utils';
import {
  ScrollableView,
  ScrollableViewItem,
} from '../../../ui/navbar/scrollable-view';
import { SearchIcon } from '../../../common/icons/material/Search';
import {ActiveToolOverlay} from '../../../state/editor-state';
import {ToolName} from '../../tool-name';

const ImageNav = () => {
  return (
    <ScrollableView className="h-full py-10 flex gap-10 tiny-scrollbar">
      <ScrollableViewItem>
        <div
          className="h-70 cursor-pointer w-86 flex px-10 justify-center items-center flex-col border rounded-xl"
          onClick={() => {
            (window as any).isImageToBeAdded = true;

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
          className="w-86 h-70 flex px-10 cursor-pointer justify-center items-center flex-col border rounded-xl"
          onClick={async () => {
            await tools().import.uploadAndAddImage();
          }}
        >
          <div className="mb-1">
            <FileUploadIcon className="text-2xl" />
          </div>
          <div className="text-xs whitespace-nowrap">Upload Image</div>
        </div>
      </ScrollableViewItem>
    </ScrollableView>
  );
};

export default ImageNav;
