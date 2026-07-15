import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href, router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { useSession } from '../../providers/session-provider';
import { DaycareLayoutMode } from '../../services/desktop/layout';
import { Text, useAppTheme } from '../../theme/theme';

type NavItem = {
  label: string;
  href: Href;
  match: string;
  icon: (color: string) => React.ReactNode;
};

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/(daycare)/(tabs)' as Href,
    match: '/',
    icon: (color) => <MaterialIcons name="dashboard" color={color} size={22} />,
  },
  {
    label: 'Daily Care',
    href: '/(daycare)/daily-care' as Href,
    match: '/daily-care',
    icon: (color) => <MaterialCommunityIcons name="clipboard-check-outline" color={color} size={22} />,
  },
  {
    label: 'Aktivitas',
    href: '/(daycare)/(tabs)/activities' as Href,
    match: '/activities',
    icon: (color) => <MaterialCommunityIcons name="calendar-check" color={color} size={22} />,
  },
  {
    label: 'Anak',
    href: '/(daycare)/(tabs)/children' as Href,
    match: '/children',
    icon: (color) => <MaterialCommunityIcons name="baby-face-outline" color={color} size={23} />,
  },
  {
    label: 'Orang Tua',
    href: '/(daycare)/parents' as Href,
    match: '/parents',
    icon: (color) => <MaterialCommunityIcons name="account-heart-outline" color={color} size={22} />,
  },
  {
    label: 'Tim',
    href: '/(daycare)/(tabs)/users' as Href,
    match: '/users',
    icon: (color) => <MaterialIcons name="people" color={color} size={22} />,
  },
  {
    label: 'Template',
    href: '/(daycare)/template' as Href,
    match: '/template',
    icon: (color) => <MaterialCommunityIcons name="shape-outline" color={color} size={22} />,
  },
  {
    label: 'Master Aktivitas',
    href: '/(daycare)/master-activities' as Href,
    match: '/master-activities',
    icon: (color) => <MaterialCommunityIcons name="calendar-edit" color={color} size={22} />,
  },
  {
    label: 'Kategori',
    href: '/(daycare)/category-config' as Href,
    match: '/category-config',
    icon: (color) => <MaterialCommunityIcons name="tag-multiple-outline" color={color} size={22} />,
  },
];

function isActive(pathname: string, item: NavItem) {
  if (item.match === '/') {
    return pathname === '/' || pathname === '/(daycare)' || pathname === '/(daycare)/(tabs)';
  }

  return pathname.includes(item.match);
}

export function DaycareDesktopShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: Exclude<DaycareLayoutMode, 'mobile'>;
}) {
  const theme = useAppTheme();
  const pathname = usePathname();
  const { session, signOut } = useSession();
  const compact = mode === 'compactDesktop';

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <View
        style={[
          styles.sidebar,
          compact && styles.sidebarCompact,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        <View>
          <View style={[styles.brandRow, compact && styles.brandRowCompact]}>
            <View style={[styles.brandMark, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.brandInitial}>M</Text>
            </View>
            {!compact ? (
              <View style={styles.brandText}>
                <Text style={[styles.brandName, { color: theme.colors.textPrimary }]}>Mami</Text>
                <Text style={[styles.brandMeta, { color: theme.colors.textSecondary }]}>Daycare</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.navList}>
            {navItems.map((item) => {
              const active = isActive(pathname, item);
              const color = active ? theme.colors.primary : theme.colors.textSecondary;

              return (
                <Pressable
                  key={item.label}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityState={{ selected: active }}
                  onPress={() => router.push(item.href)}
                  style={[
                    styles.navItem,
                    compact && styles.navItemCompact,
                    {
                      backgroundColor: active ? '#EEF2FF' : 'transparent',
                      borderColor: active ? '#C7D2FE' : 'transparent',
                    },
                  ]}
                >
                  {item.icon(color)}
                  {!compact ? <Text style={[styles.navLabel, { color }]}>{item.label}</Text> : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.accountPanel, compact && styles.accountPanelCompact, { borderColor: theme.colors.border }]}>
          {!compact ? (
            <View style={styles.accountText}>
              <Text numberOfLines={1} style={[styles.accountName, { color: theme.colors.textPrimary }]}>
                {session?.ownerName ?? 'Owner'}
              </Text>
              <Text numberOfLines={1} style={[styles.accountEmail, { color: theme.colors.textSecondary }]}>
                {session?.ownerEmail ?? 'daycare'}
              </Text>
            </View>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Keluar"
            onPress={handleSignOut}
            style={[styles.signOutButton, { borderColor: theme.colors.border }]}
          >
            <MaterialIcons name="logout" size={20} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 0,
  },
  sidebar: {
    width: 268,
    borderRightWidth: 1,
    justifyContent: 'space-between',
    paddingBottom: 18,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  sidebarCompact: {
    alignItems: 'center',
    paddingHorizontal: 12,
    width: 82,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 48,
  },
  brandRowCompact: {
    justifyContent: 'center',
  },
  brandMark: {
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  brandInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  brandText: {
    flex: 1,
    minWidth: 0,
  },
  brandName: {
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
  },
  brandMeta: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  navList: {
    gap: 6,
    marginTop: 26,
  },
  navItem: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  navItemCompact: {
    gap: 0,
    justifyContent: 'center',
    paddingHorizontal: 0,
    width: 48,
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  accountPanel: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingTop: 14,
  },
  accountPanelCompact: {
    justifyContent: 'center',
    width: '100%',
  },
  accountText: {
    flex: 1,
    minWidth: 0,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  accountEmail: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  signOutButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
});
