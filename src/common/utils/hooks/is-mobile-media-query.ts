import {useMediaQuery} from './use-media-query';

export function useIsMobileMediaQuery() {
  return useMediaQuery('(max-width: 800px)');
}
