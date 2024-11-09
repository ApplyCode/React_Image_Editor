import {FontFaceConfig} from './font-face-config';
import {assetUrl} from '../../../utils/asset-url';

export function loadFonts(fonts: FontFaceConfig[]): Promise<FontFace[]> {
  const promises = fonts.map(async fontConfig => {
    const loadedFont = Array.from(document.fonts.values()).find(current => {
      return current.family === fontConfig.family;
    });
    if (loadedFont) {
      return loadedFont.loaded;
    }
    const fontFace = new FontFace(
      fontConfig.family,
      `url(${assetUrl(fontConfig.src)})`,
      fontConfig.descriptors
    );
    document.fonts.add(fontFace);
    return fontFace.load();
  });
  return Promise.all(promises);
}
