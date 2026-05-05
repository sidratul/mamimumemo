import { ThemeProvider } from '@shopify/restyle';
import { PaperProvider } from 'react-native-paper';
import { BottomSheetModalProvider, OverlayProvider } from '@mami/ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SessionProvider } from './session-provider';
import { theme } from '../theme/theme';
import { paperTheme } from '../theme/paper-theme';

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <PaperProvider theme={paperTheme}>
            <BottomSheetModalProvider>
              <OverlayProvider>{children}</OverlayProvider>
            </BottomSheetModalProvider>
          </PaperProvider>
        </ThemeProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}
