import { Platform, useWindowDimensions } from 'react-native';

import { isDesktopRuntime } from './runtime';

export type DaycareLayoutMode = 'mobile' | 'compactDesktop' | 'desktop';

export function useDaycareLayoutMode(): DaycareLayoutMode {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isTauri = isDesktopRuntime();

  if ((isTauri && width >= 1024) || (!isTauri && isWeb && width >= 1200)) {
    return 'desktop';
  }

  if ((isTauri && width >= 768) || (!isTauri && isWeb && width >= 1024)) {
    return 'compactDesktop';
  }

  return 'mobile';
}
