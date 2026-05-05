import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { BottomSheetModalProvider, OverlayProvider } from '@mami/ui';

import { SessionProvider } from '../providers/session-provider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <PaperProvider>
          <BottomSheetModalProvider>
            <OverlayProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(public)" />
                <Stack.Screen name="(app)" />
              </Stack>
              <StatusBar style="dark" />
            </OverlayProvider>
          </BottomSheetModalProvider>
        </PaperProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}
