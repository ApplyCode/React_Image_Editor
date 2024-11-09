import {Pixie} from './pixie';
import {EditorMode} from './config/editor-mode';
import {EditorTheme} from './config/editor-theme';

(window as any).pixie = await Pixie.init({
  selector: '#editor-container',
  crossOrigin: true,
  // image: 'images/samples/large_sample.jpg',
  onLoad: () => {
    console.log('ready!');
  },
  objectControls: {
    global: {
      unlockAspectRatio: true,
    },
    shape: {
      hideTopLeft: true,
    },
  },
  tools: {
    zoom: {
      allowUserZoom: true,
    },
    crop: {
      defaultRatio: '16:9',
    },
  },
  ui: {
    mode: EditorMode.OVERLAY,
    activeTheme: EditorTheme.LIGHT,
    showExportPanel: true,
  },
});
