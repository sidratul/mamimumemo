import { MD3LightTheme, type MD3Theme } from 'react-native-paper';

import { theme } from './theme';

export const paperTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: theme.colors.primary,
    secondary: theme.colors.textSecondary,
    background: theme.colors.background,
    surface: theme.colors.surface,
    error: theme.colors.danger,
    onPrimary: '#FFFFFF',
    onSurface: theme.colors.textPrimary,
    onBackground: theme.colors.textPrimary,
  },
  roundness: 10,
};
