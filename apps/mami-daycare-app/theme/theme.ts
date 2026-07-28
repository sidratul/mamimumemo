import { createBox, createText, createTheme, useTheme as useRestyleTheme } from '@shopify/restyle';

export const theme = createTheme({
  colors: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#4F46E5', // Indigo 600
    onPrimary: '#FFFFFF',
    textPrimary: '#0F172A', // Slate 900
    textSecondary: '#64748B', // Slate 500
    border: '#E2E8F0', // Slate 200
    backdrop: 'rgba(15, 23, 42, 0.42)',
    success: '#10B981', // Emerald 500
    danger: '#EF4444', // Red 500
  },
  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  borderRadii: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  textVariants: {
    defaults: {
      color: 'textPrimary',
      fontSize: 15,
      lineHeight: 22,
    },
    title: {
      color: 'textPrimary',
      fontSize: 32,
      fontWeight: '800',
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    subtitle: {
      color: 'textSecondary',
      fontSize: 16,
      lineHeight: 24,
    },
    cardTitle: {
      color: 'textSecondary',
      fontSize: 14,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      lineHeight: 20,
    },
    cardValue: {
      color: 'textPrimary',
      fontSize: 28,
      fontWeight: '800',
      lineHeight: 34,
    },
    buttonLabel: {
      color: 'surface',
      fontSize: 16,
      fontWeight: '700',
      lineHeight: 24,
    },
    bodySmall: {
      color: 'textSecondary',
      fontSize: 13,
      lineHeight: 18,
    },
  },
});

export type AppTheme = typeof theme;

export const Box = createBox<AppTheme>();
export const Text = createText<AppTheme>();

export function useAppTheme() {
  return useRestyleTheme<AppTheme>();
}
