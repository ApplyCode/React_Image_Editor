import {IAllFilters} from 'fabric/fabric-impl';
import {defineMessages, MessageDescriptor} from 'react-intl';

export interface FilterConfig {
  name: string;
  fabricType?: string;
  uses?: keyof IAllFilters;
  options?: FilterOptions;
  initialConfig?: {[key: string]: any};
  matrix?: number[];
  apply?: Function;
}

export interface FilterOptions {
  [key: string]: SliderOptions | SelectOptions | ColorOptions;
}

interface SliderOptions {
  type: 'slider';
  current: number;
  min: number;
  max: number;
  step?: number;
}

interface SelectOptions {
  type: 'select';
  current: string;
  available: {key: string}[];
}

interface ColorOptions {
  type: 'colorPicker';
  current: string;
}

export const filterList: FilterConfig[] = [
  {name: 'grayscale'},
  {name: 'blackWhite', fabricType: 'blackwhite'},
  {
    name: 'sharpen',
    uses: 'Convolute',
    matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  },
  {name: 'invert'},
  {name: 'vintage'},
  {name: 'polaroid'},
  {name: 'kodachrome'},
  {name: 'technicolor'},
  {name: 'brownie'},
  {name: 'sepia'},
  {
    name: 'removeColor',
    fabricType: 'removecolor',
    options: {
      distance: {type: 'slider', current: 0.1, min: 0, max: 1, step: 0.01},
      color: {current: '#fff', type: 'colorPicker'},
    },
  },
  {
    name: 'brightness',
    options: {
      brightness: {type: 'slider', current: 0.1, min: -1, max: 1, step: 0.1},
    },
  },
  {
    name: 'gamma',
    options: {
      red: {type: 'slider', current: 0.1, min: 0.2, max: 2.2, step: 0.003921},
      green: {type: 'slider', current: 0.1, min: 0.2, max: 2.2, step: 0.003921},
      blue: {type: 'slider', current: 0.1, min: 0.2, max: 2.2, step: 0.003921},
    },
    apply: (filter: any) => {
      filter.gamma = [filter.red, filter.green, filter.blue];
    },
  },
  {
    name: 'noise',
    options: {
      noise: {type: 'slider', current: 40, min: 1, max: 600},
    },
  },
  {
    name: 'pixelate',
    options: {
      blocksize: {type: 'slider', min: 1, max: 40, current: 6},
    },
  },
  {
    name: 'blur',
    uses: 'Convolute',
    matrix: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
  },
  {
    name: 'emboss',
    uses: 'Convolute',
    matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
  },
  {
    name: 'blendColor',
    fabricType: 'blendcolor',
    options: {
      alpha: {type: 'slider', current: 0.5, min: 0.1, max: 1, step: 0.1},
      mode: {
        current: 'add',
        type: 'select',
        available: [
          {key: 'add'},
          {key: 'multiply'},
          {key: 'subtract'},
          {key: 'diff'},
          {key: 'screen'},
          {key: 'lighten'},
          {key: 'darken'},
        ],
      },
      color: {type: 'colorPicker', current: '#FF4081'},
    },
  },
  {
    name: "contrast",
    fabricType: 'Contrast',
    options: {
      contrast: {type: 'slider', current: 0.1, min: -1, max: 1, step: 0.1},
    },
  },
  {
    name: "hueRotation",
    options: {
      rotation: {type: 'slider', current: 0.1, min: -2, max: 2, step: 0.1},
    },
    fabricType: 'huerotation',
  },
  {
    name: "saturation",
    options: {
      saturation: {type: 'slider', current: 0.1, min: -1, max: 1, step: 0.1},
    },
    fabricType: 'Saturation',
  },
  {
    name: "vibrance",
    options: {
      vibrance: {type: 'slider', current: 0.1, min: -10, max: 10, step: 0.1},
    },
    fabricType: 'Vibrance',
  },
  {
    name: "exposure",
    options: {
      exposure: {type: 'slider', current: 1.1, min: 0.2, max: 2.2, step: 0.003921},
    },
    // @ts-ignore
    uses: "gamma",
    apply: (filter: any) => {
      const e = filter.exposure;
      filter.gamma = [e, e, e];
    }
  }
];

export const filterNameMessages: Record<string, MessageDescriptor> =
  defineMessages({
    grayscale: {defaultMessage: 'grayscale', description: 'Filter name'},
    blackWhite: {defaultMessage: 'Black & White', description: 'Filter name'},
    sharpen: {defaultMessage: 'Sharpen', description: 'Filter name'},
    invert: {defaultMessage: 'Invert', description: 'Filter name'},
    vintage: {defaultMessage: 'Vintage', description: 'Filter name'},
    polaroid: {defaultMessage: 'Polaroid', description: 'Filter name'},
    kodachrome: {defaultMessage: 'Kodachrome', description: 'Filter name'},
    technicolor: {defaultMessage: 'Technicolor', description: 'Filter name'},
    brownie: {defaultMessage: 'Brownie', description: 'Filter name'},
    sepia: {defaultMessage: 'Sepia', description: 'Filter name'},
    removeColor: {defaultMessage: 'Remove Color', description: 'Filter name'},
    brightness: {defaultMessage: 'Brightness', description: 'Filter name'},
    gamma: {defaultMessage: 'Gamma', description: 'Filter name'},
    noise: {defaultMessage: 'Noise', description: 'Filter name'},
    pixelate: {defaultMessage: 'Pixelate', description: 'Filter name'},
    blur: {defaultMessage: 'Blur', description: 'Filter name'},
    emboss: {defaultMessage: 'Emboss', description: 'Filter name'},
    blendColor: {defaultMessage: 'Blend Color', description: 'Filter name'},
    contrast: {defaultMessage: 'Contrast', description: 'Filter name'},
    hueRotation: {defaultMessage: 'HueRotation', description: 'Filter name'},
    saturation: {defaultMessage: 'saturation', description: 'Filter name'},
    vibrance: {defaultMessage: 'Vibrance', description: 'Filter name'},
    exposure: {defaultMessage: 'Exposure', description: 'Filter name'},
  });

export const filterOptionMessages: Record<string, MessageDescriptor> =
  defineMessages({
    distance: {defaultMessage: 'distance', description: 'Filter options'},
    color: {defaultMessage: 'color', description: 'Filter options'},
    brightness: {defaultMessage: 'brightness', description: 'Filter options'},
    red: {defaultMessage: 'red', description: 'Filter options'},
    green: {defaultMessage: 'green', description: 'Filter options'},
    blue: {defaultMessage: 'blue', description: 'Filter options'},
    noise: {defaultMessage: 'noise', description: 'Filter options'},
    blocksize: {defaultMessage: 'blocksize', description: 'Filter options'},
    mode: {defaultMessage: 'mode', description: 'Filter options'},
    alpha: {defaultMessage: 'alpha', description: 'Filter options'},
    contrast: {defaultMessage: 'contrast', description: 'Filter options'},
    rotation: {defaultMessage: 'angle', description: 'Filter options'},
    saturation: {defaultMessage: 'saturation', description: 'Filter options'},
    vibrance: {defaultMessage: 'vibrance', description: 'Filter options'},
    exposure: {defaultMessage: 'exposure', description: 'Filter options'},
  });
