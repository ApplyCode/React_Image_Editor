import {fabric} from 'fabric';
import {staticObjectConfig} from '../../objects/static-object-config';
import {ObjectName} from '../../objects/object-name';
import {loadFabricImage} from './load-fabric-image';
import {LoadingType} from '../../state/editor-state';
import {fabricCanvas, state, tools} from '../../state/utils';
import {canvasIsEmpty} from './canvas-is-empty';
import {fetchStateJsonFromUrl} from '../import/fetch-state-json-from-url';
import pica from 'pica';
import { uploadMediaImage } from './uploader';
type Image = fabric.Image;
type IImageOptions = fabric.IImageOptions;
const MAX_IMAGE_PIXELS = 1500
export class PixieCanvas {
  private readonly minWidth: number = 50;
  private readonly minHeight: number = 50;

  resize(
    width: number,
    height: number,
    {
      applyZoom = false,
      resizeHelper = true,
    }: {applyZoom?: boolean; resizeHelper?: boolean} = {}
  ) {
    const currentZoom = state().zoom;
    fabricCanvas().setWidth(width * (applyZoom ? currentZoom : 1));
    fabricCanvas().setHeight(height * (applyZoom ? currentZoom : 1));
    state().setOriginal(width, height);
    if (resizeHelper) {
      tools().transform.resetStraightenAnchor();
    }
  }

  async addMainImage(
    url: string | Image,
    loadStateName: LoadingType = 'mainImage'
  ): Promise<Image | undefined> {
    if (typeof url === 'string') {
      state().toggleLoading(loadStateName);
    }
    let img: Image;
    if (typeof url === 'string') {
      const uploadedImageUrl = await uploadMediaImage(url);
      img = await loadFabricImage(uploadedImageUrl);
      if (!img) return;
    } else {
      img = url;
    }
    if (img.width! > MAX_IMAGE_PIXELS || img.height! > MAX_IMAGE_PIXELS) {
      const canvas = document.createElement('canvas');
      if(img.width! > MAX_IMAGE_PIXELS) {
        canvas.width = MAX_IMAGE_PIXELS;
        canvas.height = img.height! * (MAX_IMAGE_PIXELS / img.width!);
      } else if(img.height! > MAX_IMAGE_PIXELS) {
        canvas.height = MAX_IMAGE_PIXELS;
        canvas.width = img.width! * (MAX_IMAGE_PIXELS / img.height!);
      } else {
        canvas.width = img.width!;
        canvas.height = img.height!;
      }
      const base64 = await pica().resize(img.toCanvasElement() as HTMLCanvasElement, canvas, {
        unsharpAmount: 0.5,
        unsharpRadius: 0.5,
        unsharpThreshold: 0.5,
      });
      console.log(base64.toDataURL());
      return new Promise<Image>(resolve => {
        fabric.Image.fromURL(base64.toDataURL(), async (img) => {
          await this.addMainImage(img);
          resolve(img);
        });
      });
    }

    if (!state().replaced) {
      this.clear();
    } else {
      state().setConfig({image: undefined, blankCanvasSize: undefined});
      tools().objects.delete(tools().objects.get(ObjectName.MainImage));
    }
    img.set(staticObjectConfig as IImageOptions);
    img.name = ObjectName.MainImage;
    fabricCanvas().add(img);
    fabricCanvas().requestRenderAll();
    if (state().replaced) {
      tools().objects.sendToBack(img);
    }
    this.resize(img.width!, img.height!);
    img.center();
    img.setCoords();
    tools().zoom.fitToScreen();
    state().toggleLoading(false);
    state().config.onMainImageLoaded?.(img);
    if (state().replaced) {
      tools().history.addHistoryItem({name: 'replaceImage'});
    }
    return img;
  }

  openNew(
    width: number,
    height: number,
    bgColor?: string
  ): Promise<{width: number; height: number}> {
    width = Math.max(this.minWidth, width);
    height = Math.max(this.minHeight, height);

    if (!state().replaced) {
      this.clear();
    }
    this.resize(width, height);
    fabricCanvas().backgroundColor = bgColor;

    tools().zoom.fitToScreen();
    state().toggleLoading('newCanvas');
    requestAnimationFrame(() => {
      state().toggleLoading(false);
    });
    return Promise.resolve({width, height});
  }

  /**
   * Get main image object, if it exists.
   */
  getMainImage(): Image {
    return fabricCanvas()
      .getObjects()
      .find(obj => obj.name === ObjectName.MainImage) as Image;
  }

  render() {
    fabricCanvas().requestRenderAll();
  }

  async loadInitialContent(): Promise<void> {
    const image = state().config.image;
    const size = state().config.blankCanvasSize;
    const stateJson = state().config.state;
    if (image && image.endsWith('json')) {
      const stateObj = await fetchStateJsonFromUrl(image);
      await tools().import.loadState(stateObj);
    } else if (image && image.startsWith('{"canvas')) {
      await tools().import.loadState(image);
    } else if (image) {
      await this.addMainImage(image);
    } else if (stateJson) {
      await tools().import.loadState(stateJson);
    } else if (size) {
      await this.openNew(size.width, size.height);
    }
    if (canvasIsEmpty() && state().config.ui?.openImageDialog?.show) {
      state().togglePanel('newImage', true);
    }
    // delay adding initial so changes made in the returned promise are caught
    return new Promise<void>(resolve => {
      setTimeout(() => {
        tools().history.addInitial();
        resolve();
      }, 10);
    });
  }

  clear() {
    fabricCanvas().clear();
    tools().frame.remove();
    tools().transform.resetStraightenAnchor();
  }
}
