function colorWithOpacity(variable) {
  return ({opacityValue}) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

module.exports = {
  sharedOverride: {
    spacing: {
      px: '1px',
      0: '0px',
      1: '0.063rem',
      2: '0.125rem',
      4: '0.25rem',
      5: '0.313rem',
      6: '0.375rem',
      8: '0.5rem',
      10: '0.625rem',
      12: '0.75rem',
      14: '0.875rem',
      16: '1rem',
      18: '1.125rem',
      20: '1.25rem',
      22: '1.375rem',
      24: '1.5rem',
      26: '1.625rem',
      28: '1.75rem',
      30: '1.875rem',
      32: '2rem',
      36: '2.25rem',
      40: '2.5rem',
      42: '2.625rem',
      44: '2.75rem',
      48: '3rem',
      50: '3.125rem',
      56: '3.5rem',
      60: '3.75rem',
      64: '4rem',
      68: '4.25rem',
      70: '4.375rem',
      76: '4.75rem',
      80: '5rem',
      84: '5.25rem',
      86: '5.375rem',
      92: '5.75rem',
      96: '6rem',
      110: '6.875rem',
      112: '7rem',
      128: '8rem',
      144: '9rem',
      160: '10rem',
      176: '11rem',
      192: '12rem',
      208: '13rem',
      224: '14rem',
      240: '15rem',
      256: '16rem',
      288: '18rem',
      320: '20rem',
      375: '23.438rem',
      384: '24rem',
      '5vw': '5vw',
      '10vw': '10vw',
      'safe-area': 'env(safe-area-inset-bottom)',
      inherit: 'inherit',
    },
    colors: theme => {
      return {
        transparent: 'transparent',
        inherit: 'inherit',
        current: 'currentColor',
        white: 'rgb(255 255 255)',
        black: 'rgb(0 0 0)',
        'slider-disabled': 'rgb(189, 189, 189)',
        hover: `rgb(var(--be-foreground-base) / ${theme('opacity.hover')})`,
        focus: `rgb(var(--be-foreground-base) / ${theme('opacity.focus')})`,
        divider: `rgb(var(--be-foreground-base) / var(--be-divider-opacity))`,
        'disabled-bg':
          'rgb(var(--be-foreground-base) / var(--be-disabled-bg-opacity))',
        'disabled-fg':
          'rgb(var(--be-foreground-base) / var(--be-disabled-fg-opacity))',
        'primary-light': colorWithOpacity('--be-primary-light'),
        primary: colorWithOpacity('--be-primary'),
        'primary-dark': colorWithOpacity('--be-primary-dark'),
        'on-primary': colorWithOpacity('--be-on-primary'),
        error: colorWithOpacity('--be-error'),
        'on-error': colorWithOpacity('--be-on-error'),
        background: colorWithOpacity('--be-background'),
        paper: colorWithOpacity('--be-paper'),
        'background-alt': colorWithOpacity('--be-background-alt'),
        'fg-base': colorWithOpacity('--be-foreground-base'),
        'text-muted':
          'rgb(var(--be-foreground-base) / var(--be-text-muted-opacity))',
        'text-main':
          'rgb(var(--be-foreground-base) / var(--be-text-main-opacity))',
      };
    },
    borderColor: theme => ({
      ...theme('colors'),
      DEFAULT: theme('colors.divider'),
    }),
    textColor: theme => ({
      ...theme('colors'),
      main: theme('colors.text-main'),
      muted: theme('colors.text-muted'),
      disabled: theme('colors.disabled-fg'),
      DEFAULT: theme('colors.text-main'),
    }),
    ringColor: theme => ({
      ...theme('colors'),
      DEFAULT: colorWithOpacity('--be-primary-light'),
    }),
    backgroundColor: theme => ({
      ...theme('colors'),
      disabled: theme('colors.disabled-bg'),
      DEFAULT: colorWithOpacity('--be-background'),
      alt: colorWithOpacity('--be-background-alt'),
    }),
  },
  sharedExtend: {
    outlineColor: {
      DEFAULT: colorWithOpacity('--be-primary-light'),
    },
    outlineWidth: {
      DEFAULT: 2,
    },
    minHeight: theme => ({
      ...theme('spacing'),
    }),
    minWidth: theme => ({
      ...theme('spacing'),
    }),
    maxWidth: theme => ({
      ...theme('spacing'),
    }),
    zIndex: {
      toast: 150,
      'overlay-container': 145,
      modal: 140,
      tray: 130,
      popover: 180,
    },
    opacity: {
      4: '4%',
      8: '8%',
      12: '12%',
      26: '26%',
      15: '15%',
      87: '87%',
      selected: 'var(--be-selected-opacity)',
      hover: 'var(--be-hover-opacity)',
      focus: 'var(--be-focus-opacity)',
    },
    transitionProperty: {
      height: 'height',
      width: 'width',
      left: 'left',
      size: 'width, height',
      fill: 'fill',
      transformOpacity: 'transform, opacity',
      'bg-color': 'background-color',
      icon: 'transform, fill',
      button: 'background-color, box-shadow, border-color, color',
    },
    cursor: {
      'nwse-resize': 'nwse-resize',
      'nesw-resize': 'nesw-resize',
      'sw-resize': 'sw-resize',
      'se-resize': 'se-resize',
      inherit: 'inherit',
    },
  },
  sharedPlugins: plugin => {
    return [
      plugin(({addUtilities, addComponents, theme}) => {
        addUtilities({
          '.icon-xs': {
            'font-size': '1rem',
          },
          '.icon-sm': {
            'font-size': '1.25rem',
          },
          '.icon-md': {
            'font-size': '1.5rem',
          },
          '.icon-lg': {
            'font-size': '2.1875rem',
          },
          '.icon-xl': {
            'font-size': '2.6875rem',
          },
          '.no-tap-highlight': {
            '-webkit-tap-highlight-color': 'transparent',
          },
        });
        addComponents({
          '.svg-icon': {
            '@apply select-none inline-block fill-current flex-shrink-0 transition-icon':
              {},
          },
        });
      }),
    ];
  },
};
