import color from 'color';
import {useStore} from '../state/store';
import {PixieTheme} from '../config/default-config';
import {DEFAULT_THEMES} from '../config/default-themes';

export function initThemes(rootEl: HTMLElement, activeTheme?: PixieTheme) {
  if (!activeTheme) return;

  const defaultTheme = activeTheme.isDark
    ? DEFAULT_THEMES.find(t => t.isDark)!
    : DEFAULT_THEMES.find(t => !t.isDark)!;

  const mergedTheme = {
    ...defaultTheme,
    ...activeTheme,
    colors: {
      ...defaultTheme.colors,
      ...activeTheme.colors,
    },
  };

  Object.entries(mergedTheme.colors).forEach(([key, value]) => {
    rootEl.style.setProperty(key, parseThemeValue(value));
  });
  if (activeTheme.isDark) {
    rootEl.classList.add('dark');
  } else {
    rootEl.classList.remove('dark');
  }
}

function parseThemeValue(value: string) {
  // opacity or rgb string: 0 0 0
  if (value.endsWith('%') || value.split(' ').length === 3) {
    return value;
  }
  // convert user provided color to rgb string
  return color(value).rgb().array().slice(0, 3).join(' ');
}

export function useActiveTheme() {
  const activeTheme = useStore(s => s.config.ui?.activeTheme);
  return useStore(s =>
    (s.config.ui?.themes || []).find(t => t.name === activeTheme)
  );
}
