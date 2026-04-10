import { ThemeProvider } from '@shopify/restyle';
import { ApolloProvider } from '@apollo/client/react';
import { PaperProvider } from 'react-native-paper';
import { BottomSheetModalProvider } from '@mami/ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SessionProvider } from './session-provider';
import { apolloClient } from '../services/apollo';
import { theme } from '../theme/theme';
import { paperTheme } from '../theme/paper-theme';

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <PaperProvider theme={paperTheme}>
              <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
            </PaperProvider>
          </ThemeProvider>
        </ApolloProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}
