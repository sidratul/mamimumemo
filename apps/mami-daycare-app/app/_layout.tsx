import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle';
import { PaperProvider } from 'react-native-paper';
import { BottomSheetModalProvider } from '@mami/ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SessionProvider } from '../providers/session-provider';
import { theme } from '../theme/theme';
import { paperTheme } from '../theme/paper-theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RestyleThemeProvider theme={theme}>
        <SessionProvider>
          <PaperProvider theme={paperTheme}>
            <BottomSheetModalProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(daycare)" />
              </Stack>
              <StatusBar style="dark" />
            </BottomSheetModalProvider>
          </PaperProvider>
        </SessionProvider>
      </RestyleThemeProvider>
    </GestureHandlerRootView>
  );
}
