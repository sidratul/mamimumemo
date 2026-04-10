import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

type ScreenSectionProps = {
  children: ReactNode;
  padded?: boolean;
  gap?: number;
};

export function ScreenSection({ children, padded = true, gap = 12 }: ScreenSectionProps) {
  const theme = useTheme();

  return (
    <View style={padded ? styles.outer : undefined}>
      <View
        style={[
          styles.inner,
          {
            gap,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
          },
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 24,
  },
  inner: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
});
