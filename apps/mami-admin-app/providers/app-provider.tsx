import { ThemeProvider } from '@shopify/restyle';
import { ApolloProvider } from '@apollo/client/react';
import { PaperProvider } from 'react-native-paper';

import { SessionProvider } from './session-provider';
import { apolloClient } from '../services/apollo';
import { theme } from '../theme/theme';
import { paperTheme } from '../theme/paper-theme';

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <SessionProvider>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <PaperProvider theme={paperTheme}>{children}</PaperProvider>
        </ThemeProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}
