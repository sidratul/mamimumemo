import { createBox, createText, createTheme, useTheme as useRestyleTheme } from '@shopify/restyle';

export const theme = createTheme({
  colors: {
    background: '#FFF9F3',
    surface: '#FFFFFF',
    primary: '#F15A29',
    textPrimary: '#4B2A18',
    textSecondary: '#8A6A56',
    border: '#F4D7C7',
    success: '#74B72E',
    danger: '#D64545',
  },
  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  borderRadii: {
    none: 0,
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
  },
  textVariants: {
    defaults: {
      color: 'textPrimary',
      fontSize: 14,
    },
    title: {
      color: 'textPrimary',
      fontSize: 28,
      fontWeight: '700',
    },
    subtitle: {
      color: 'textSecondary',
      fontSize: 15,
    },
    cardTitle: {
      color: 'textSecondary',
      fontSize: 13,
    },
    cardValue: {
      color: 'textPrimary',
      fontSize: 24,
      fontWeight: '700',
    },
    buttonLabel: {
      color: 'surface',
      fontSize: 15,
      fontWeight: '600',
    },
  },
});

export type AppTheme = typeof theme;

export const Box = createBox<AppTheme>();
export const Text = createText<AppTheme>();

export function useAppTheme() {
  return useRestyleTheme<AppTheme>();
}
