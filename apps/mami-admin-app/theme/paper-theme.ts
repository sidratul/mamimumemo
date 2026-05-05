import { MD3LightTheme, type MD3Theme } from 'react-native-paper';

import { theme } from './theme';

export const paperTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: theme.colors.primary,
    secondary: '#6366F1',
    tertiary: '#F59E0B',
    background: theme.colors.background,
    surface: theme.colors.surface,
    error: theme.colors.danger,
    onPrimary: '#FFFFFF',
    onSurface: theme.colors.textPrimary,
    onBackground: theme.colors.textPrimary,
    outline: theme.colors.border,
    surfaceVariant: '#F1F5F9',
  },
  roundness: 12,
};
