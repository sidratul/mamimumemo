import { createBox, createText, createTheme, useTheme as useRestyleTheme } from '@shopify/restyle';

export const theme = createTheme({
  colors: {
    background: '#F7F9FC',
    surface: '#FFFFFF',
    primary: '#4D96FF',
    textPrimary: '#24324B',
    textSecondary: '#5F6C84',
    border: '#E2E8F2',
    success: '#6BCB77',
    danger: '#FF4D4D',
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
