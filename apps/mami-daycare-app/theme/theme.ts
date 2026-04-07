import { createBox, createText, createTheme } from '@shopify/restyle';

export const theme = createTheme({
  colors: {
    background: '#FFF8F4',
    surface: '#FFFFFF',
    primary: '#C75B39',
    textPrimary: '#3D2218',
    textSecondary: '#8E5C4A',
    border: '#F0D5C9',
    success: '#1F9D63',
    danger: '#C6285A',
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
