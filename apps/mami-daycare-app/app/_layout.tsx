import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle';
import { PaperProvider } from 'react-native-paper';

import { SessionProvider } from '../providers/session-provider';
import { theme } from '../theme/theme';
import { paperTheme } from '../theme/paper-theme';

export default function RootLayout() {
  return (
    <RestyleThemeProvider theme={theme}>
      <SessionProvider>
        <PaperProvider theme={paperTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(daycare)" />
          </Stack>
          <StatusBar style="dark" />
        </PaperProvider>
      </SessionProvider>
    </RestyleThemeProvider>
  );
}
