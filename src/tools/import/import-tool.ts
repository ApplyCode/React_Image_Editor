import {Image} from 'fabric/fabric-impl';
import {openUploadWindow} from '../../common/uploads/utils/open-upload-window';
import {UploadedFile} from '../../common/uploads/uploaded-file';
import {ObjectName} from '../../objects/object-name';
import {SerializedPixieState} from '../history/serialized-pixie-state';
import {ImportToolValidator} from './import-tool-validator';
import {addImage} from '../canvas/add-image';
import {state, tools} from '../../state/utils';
import {resetEditor} from '../../utils/reset-editor';
import {UploadAccentProps} from '../../common/uploads/utils/create-upload-input';
import {UploadInputType} from '../../common/uploads/upload-input-config';
import {fetchStateJsonFromUrl} from './fetch-state-json-from-url';

export class ImportTool {
  private validator = new ImportToolValidator();

  /**
   * Open file upload window and add selected image to canvas.
   */
  async uploadAndAddImage(): Promise<void> {
    const file = await this.openUploadWindow();
    await this.openUploadedFile(file);
  }

  /**
   * Open file upload window and replace canvas contents with selected image.
   */
  async uploadAndReplaceMainImage(): Promise<void> {
    const file = await this.openUploadWindow();
    if (file) {
      await this.openBackgroundImage(file);
      state().togglePanel('newImage', false);
    }
  }

  /**
   * Open file upload window and replace canvas contents with selected state file.
   */
  async uploadAndOpenStateFile(): Promise<void> {
    const file = await this.openUploadWindow(stateContentType);
    if (file) {
      await this.loadState(await file.data);
    }
  }

  /**
   * @hidden
   */
  async openUploadedFile(file?: UploadedFile | null) {
    if (!file) return;
    const fileData = await file.data;
    switch (file.extension) {
      case 'json':
        await this.loadState(fileData);
        break;
      case 'svg':
        await tools().shape.addSvgSticker(fileData, ObjectName.Image);
        tools().history.addHistoryItem({name: 'overlayImage'});
        break;
      default:
        await addImage(
          fileData,
          state().config.tools?.import?.fitOverlayToScreen ?? true
        );
        tools().history.addHistoryItem({name: 'overlayImage'});
    }
  }

  /**
   * Replace current editor state with specified one.
   */
  async loadState(data: string | SerializedPixieState): Promise<void> {
    state().toggleLoading('state');
    if ((data as SerializedPixieState)?.canvas?.objects?.length) {
      // loop over objects and get last object that has type == 'image' and name == "mainImage", then delete all objects before last match
      const objects = (data as SerializedPixieState).canvas.objects;
      const mainImage = objects
        .slice()
        .reverse()
        .find((obj) => obj.type === 'image' && obj.name === 'mainImage');
      if (mainImage) {
        const index = objects.indexOf(mainImage);
        if (index > 0) {
          objects.splice(0, index);
        }
      }
    }
    if(!state().replaced) {
      await resetEditor();
    }

    let stateObj: SerializedPixieState;

    if (typeof data === 'string') {
      if (data.endsWith('.json')) {
        stateObj = await fetchStateJsonFromUrl(data);
      } else {
        stateObj = JSON.parse(data);
      }
    } else {
      stateObj = data;
    }

    tools().history.addInitial(stateObj);
    await tools().history.reload();
    state().toggleLoading(false);
  }

  /**
   * @hidden
   */
  async openUploadWindow(
    contentTypes?: UploadAccentProps
  ): Promise<UploadedFile | null> {
    contentTypes = contentTypes || imgContentTypes();
    const file = (await openUploadWindow(contentTypes))[0];
    if (this.fileIsValid(file)) {
      state().config.onFileOpen?.(file);
      return file;
    }
    return null;
  }

  /**
   * Open specified data or image as background image.
   */
  async openBackgroundImage(
    image: UploadedFile | HTMLImageElement | string | Image,
  ): Promise<Image | undefined> {
    const replace = state().replaced;
    if(!replace) {
      await resetEditor();
    }
    let src: string | Image;
    if (image instanceof HTMLImageElement) {
      src = image.src;
    } else if (image instanceof UploadedFile) {
      src = await image.data;
    } else if(typeof image === 'string') {
      src = image;
    } else {
      src = image;
    }

    const response = await tools().canvas.addMainImage(src);
    if(!replace) {
      tools().history.addInitial();
    }
    return response;
  }

  private fileIsValid(file: UploadedFile): boolean {
    return !this.validator.validate(file).failed;
  }

  /**
   * @hidden
   */
  async openOverlayImage(
    src: string,
  ): Promise<Image | undefined> {
    const response = await addImage(
      src as any,
      state().config.tools?.import?.fitOverlayToScreen ?? true
    );

    tools().history.addHistoryItem({name: 'overlayImage'});

    return response;
  }
}


export function imgContentTypes(): UploadAccentProps {
  const validExtensions = state().config.tools?.import?.validImgExtensions;
  if (validExtensions) {
    return {extensions: validExtensions};
  }
  return {types: [UploadInputType.image]};
}

export const stateContentType: UploadAccentProps = {
  types: ['.json', UploadInputType.json],
};
