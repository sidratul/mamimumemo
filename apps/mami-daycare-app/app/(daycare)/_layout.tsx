import { Stack } from 'expo-router';

import { DaycareDesktopShell } from '../../components/organisms/DaycareDesktopShell';
import { useDaycareLayoutMode } from '../../services/desktop/layout';

export default function DaycareLayout() {
  const layoutMode = useDaycareLayoutMode();

  const stack = <Stack screenOptions={{ headerShown: false }} />;

  if (layoutMode === 'mobile') {
    return stack;
  }

  return <DaycareDesktopShell mode={layoutMode}>{stack}</DaycareDesktopShell>;
}
