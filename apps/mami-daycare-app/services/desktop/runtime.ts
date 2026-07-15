import { Platform } from 'react-native';

type TauriWindow = Window & {
  __TAURI_INTERNALS__?: unknown;
};

export function isDesktopRuntime() {
  return Platform.OS === 'web' && typeof window !== 'undefined' && Boolean((window as TauriWindow).__TAURI_INTERNALS__);
}
