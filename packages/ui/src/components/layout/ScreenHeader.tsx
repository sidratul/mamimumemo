import { StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

export function ScreenHeader({ title, subtitle, onBack }: ScreenHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onBack ? <Appbar.BackAction onPress={onBack} color={theme.colors.onSurface} /> : null}
        <View style={styles.content}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant ?? theme.colors.onSurface }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {},
});
