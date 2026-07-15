import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { AuthScreen } from '@mami/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useDaycareLayoutMode } from '../../../services/desktop/layout';
import { Box, Text, useAppTheme } from '../../../theme/theme';
import { useSession } from '../../../providers/session-provider';
import { LoginForm } from './LoginForm';

const logoSource = require('../../../assets/images/daycare_logo_clean.png');

export function LoginContainer() {
  const theme = useAppTheme();
  const layoutMode = useDaycareLayoutMode();
  const { isLoading, session } = useSession();

  if (isLoading) {
    return null;
  }

  if (session) {
    return <Redirect href="/(daycare)/(tabs)" />;
  }

  if (layoutMode !== 'mobile') {
    return <DesktopLoginView compact={layoutMode === 'compactDesktop'} />;
  }

  return (
    <AuthScreen
      heroTitle="mamimumemo"
      heroSubtitle="Setiap cerita kecil si buah hati, jadi Memo ceria buat Mamimu."
      heroLogoSource={logoSource}
      cardTitle="Halo, Pengelola!"
      cardSubtitle="Masuk untuk memantau keceriaan hari ini.">
      <Box gap="xl">
        <LoginForm />
        
        <Box flexDirection="row" justifyContent="center" alignItems="center" gap="xs">
          <Text variant="bodySmall" color="textSecondary">Belum punya akun?</Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text variant="bodySmall" color="primary" style={{ fontWeight: '800' }}>Daftar Sekarang</Text>
          </Pressable>
        </Box>
      </Box>
    </AuthScreen>
  );
}

function DesktopLoginView({ compact }: { compact: boolean }) {
  const theme = useAppTheme();

  return (
    <SafeAreaView style={[styles.desktopRoot, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right', 'bottom']}>
      <View style={[styles.desktopShell, compact && styles.desktopShellCompact]}>
        <View style={[styles.brandPane, compact && styles.brandPaneCompact]}>
          <View style={styles.logoRow}>
            <View style={[styles.logoBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Image source={logoSource} resizeMode="contain" style={styles.logo} />
            </View>
            <View style={styles.brandCopy}>
              <Text style={[styles.brandName, { color: theme.colors.textPrimary }]}>mamimumemo</Text>
              <Text style={[styles.brandMeta, { color: theme.colors.textSecondary }]}>Daycare workspace</Text>
            </View>
          </View>

          <View style={styles.heroCopy}>
            <Text style={[styles.heroEyebrow, { color: theme.colors.primary }]}>Aplikasi pengelola daycare</Text>
            <Text style={[styles.heroTitle, { color: theme.colors.textPrimary }]}>Masuk ke ruang kerja operasional.</Text>
            <Text style={[styles.heroSubtitle, { color: theme.colors.textSecondary }]}>
              Pantau anak, jadwal, kehadiran, staff, dan catatan harian dari satu dashboard desktop.
            </Text>
          </View>

          <View style={styles.featureGrid}>
            <DesktopLoginFeature icon="clipboard-check-outline" label="Daily care" />
            <DesktopLoginFeature icon="calendar-clock" label="Jadwal" />
            <DesktopLoginFeature icon="account-child-outline" label="Data anak" />
          </View>
        </View>

        <View style={styles.formPane}>
          <View style={[styles.loginPanel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.formHeader}>
              <Text style={[styles.formTitle, { color: theme.colors.textPrimary }]}>Halo, Pengelola</Text>
              <Text style={[styles.formSubtitle, { color: theme.colors.textSecondary }]}>
                Gunakan akun owner daycare untuk masuk.
              </Text>
            </View>

            <LoginForm submitLabel="Masuk ke Workspace" />

            <View style={[styles.registerRow, { borderColor: theme.colors.border }]}>
              <Text style={[styles.registerText, { color: theme.colors.textSecondary }]}>Belum punya akun?</Text>
              <Pressable accessibilityRole="button" onPress={() => router.push('/(auth)/register')}>
                <Text style={[styles.registerLink, { color: theme.colors.primary }]}>Daftar daycare</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function DesktopLoginFeature({
  icon,
  label,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
}) {
  const theme = useAppTheme();

  return (
    <View style={[styles.featureItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <MaterialCommunityIcons name={icon} size={22} color={theme.colors.primary} />
      <Text style={[styles.featureLabel, { color: theme.colors.textPrimary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  desktopRoot: {
    flex: 1,
  },
  desktopShell: {
    flex: 1,
    flexDirection: 'row',
    gap: 32,
    padding: 32,
  },
  desktopShellCompact: {
    gap: 22,
    padding: 24,
  },
  brandPane: {
    flex: 1,
    justifyContent: 'space-between',
    minWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  brandPaneCompact: {
    flex: 0.9,
  },
  logoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  logoBox: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  logo: {
    height: 42,
    width: 42,
  },
  brandCopy: {
    flex: 1,
    minWidth: 0,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },
  brandMeta: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  heroCopy: {
    gap: 12,
    maxWidth: 620,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 52,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    maxWidth: 520,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureItem: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  featureLabel: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  formPane: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minWidth: 430,
  },
  loginPanel: {
    borderRadius: 8,
    borderWidth: 1,
    gap: 26,
    maxWidth: 460,
    padding: 28,
    width: '100%',
  },
  formHeader: {
    gap: 6,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  formSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  registerRow: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingTop: 18,
  },
  registerText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },
});
