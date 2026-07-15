import { useEffect, useState, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useSession } from '../../../providers/session-provider';
import { useDaycareLayoutMode } from '../../../services/desktop/layout';
import {
  getDaycareRoster,
  type DaycareChild,
  type DaycareParent,
} from '../../../services/operations';
import { Box, Text, useAppTheme } from '../../../theme/theme';

// Atomic Components
import { OperationsHeader } from '../../../components/molecules/OperationsHeader';
import { OperationsSummarySection } from '../../../components/organisms/OperationsSummarySection';
import { OperationsQuickAction } from '../../../components/molecules/OperationsQuickAction';
import { OperationsHeroBanner } from '../../../components/molecules/OperationsHeroBanner';

export function DaycareOperationsContainer() {
  const router = useRouter();
  const theme = useAppTheme();
  const { isLoading, session } = useSession();
  const layoutMode = useDaycareLayoutMode();
  const [status] = useState<string>('APPROVED');
  const [parents, setParents] = useState<DaycareParent[]>([]);
  const [children, setChildren] = useState<DaycareChild[]>([]);

  const isApproved = status === 'APPROVED';

  const loadData = useCallback(async (activeSession = session) => {
    if (!activeSession) return;

    try {
      if (!activeSession.daycareId) {
        setParents([]);
        setChildren([]);
        console.log('[Operations] daycareId is empty, skip roster request.');
        return;
      }

      const roster = await getDaycareRoster(activeSession.token, activeSession.daycareId);
      setParents(roster.parents);
      setChildren(roster.children);
    } catch (error) {
      console.error('[Operations] Failed to load data:', error);
    }
  }, [session]);

  useEffect(() => {
    void (async () => {
      if (!session) return;
      await loadData(session);
    })();
  }, [session, loadData]);

  if (isLoading) return null;
  if (!session) return <Redirect href="/(auth)/login" />;

  if (layoutMode !== 'mobile') {
    return (
      <DesktopOperationsView
        childCount={children.length}
        children={children}
        compact={layoutMode === 'compactDesktop'}
        isApproved={isApproved}
        ownerName={session.ownerName}
        parentCount={parents.length}
        parents={parents}
        onNavigate={(href) => router.push(href as never)}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Box flex={1} padding="lg" gap="lg" paddingTop="md">
          <OperationsHeader 
            title="Ringkasan" 
            subtitle="Pantau kehadiran dan aktivitas anak hari ini." 
          />

          {/* Status Banner - Show if not approved */}
          {!isApproved && (
            <Box 
              backgroundColor="primary" 
              padding="md" 
              borderRadius="lg" 
              flexDirection="row" 
              alignItems="center" 
              gap="sm"
              style={{ opacity: 0.9 }}
            >
              <MaterialCommunityIcons name="information" size={20} color="#FFFFFF" />
              <Text color="surface" variant="bodySmall" fontWeight="700" flex={1}>
                Akun Anda sedang dalam tahap review. Beberapa fitur operasional mungkin belum dapat digunakan.
              </Text>
            </Box>
          )}

          <OperationsSummarySection 
            childCount={children.length} 
            parentCount={parents.length} 
          />

          <Box gap="md" marginTop="sm">
            <Text variant="cardTitle">Aksi Cepat</Text>
            <Box flexDirection="row" gap="md">
              <OperationsQuickAction 
                label="Jadwal" 
                icon="calendar-check" 
                color={isApproved ? "#4F46E5" : "#94A3B8"} 
                onPress={() => router.push('/(daycare)/(tabs)/activities')} 
              />
              <OperationsQuickAction 
                label="Data Anak" 
                icon="baby-face-outline" 
                color="#10B981" 
                onPress={() => router.push('/(daycare)/(tabs)/children')} 
              />
            </Box>
          </Box>

          <Box paddingVertical="xl" alignItems="center">
             <MaterialCommunityIcons name="shield-check-outline" size={48} color={isApproved ? theme.colors.success : theme.colors.border} style={{ opacity: 0.2 }} />
             <Text variant="bodySmall" color="textSecondary" marginTop="sm" textAlign="center">
                {isApproved 
                  ? "Sistem Mamimumemo aktif melindungi data Anda." 
                  : "Menunggu aktivasi sistem oleh administrator platform."}
             </Text>
          </Box>

          <Box style={{ marginTop: 'auto' }}>
            {isApproved ? (
              <OperationsHeroBanner 
                title="Buka Operasional" 
                subtitle="Mulai catat kehadiran dan laporan harian." 
              />
            ) : (
              <Box padding="lg" borderRadius="lg" backgroundColor="border" alignItems="center">
                <Text color="textSecondary" fontWeight="800">FITUR TERKUNCI</Text>
                <Text variant="bodySmall" color="textSecondary">Tersedia setelah daycare disetujui.</Text>
              </Box>
            )}
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

type DesktopOperationsViewProps = {
  childCount: number;
  children: DaycareChild[];
  compact: boolean;
  isApproved: boolean;
  ownerName: string;
  parentCount: number;
  parents: DaycareParent[];
  onNavigate: (href: string) => void;
};

function DesktopOperationsView({
  childCount,
  children,
  compact,
  isApproved,
  ownerName,
  parentCount,
  parents,
  onNavigate,
}: DesktopOperationsViewProps) {
  const theme = useAppTheme();
  const visibleChildren = children.slice(0, 6);
  const visibleParents = parents.slice(0, 5);

  return (
    <SafeAreaView style={[styles.desktopRoot, { backgroundColor: theme.colors.background }]} edges={['top', 'right']}>
      <ScrollView contentContainerStyle={styles.desktopScroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.desktopHeader, compact && styles.desktopHeaderCompact]}>
          <View style={styles.desktopHeaderText}>
            <Text style={[styles.desktopEyebrow, { color: theme.colors.textSecondary }]}>Operasional Daycare</Text>
            <Text style={[styles.desktopTitle, { color: theme.colors.textPrimary }]}>Ringkasan hari ini</Text>
            <Text style={[styles.desktopSubtitle, { color: theme.colors.textSecondary }]}>
              Pantau anak, keluarga, jadwal, dan catatan harian dari satu workspace.
            </Text>
          </View>

          <View style={[styles.desktopUserPanel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={[styles.statusDot, { backgroundColor: isApproved ? theme.colors.success : '#F59E0B' }]} />
            <View style={styles.desktopUserText}>
              <Text numberOfLines={1} style={[styles.desktopUserName, { color: theme.colors.textPrimary }]}>
                {ownerName}
              </Text>
              <Text style={[styles.desktopUserMeta, { color: theme.colors.textSecondary }]}>
                {isApproved ? 'Daycare aktif' : 'Menunggu review'}
              </Text>
            </View>
          </View>
        </View>

        {!isApproved ? (
          <View style={[styles.desktopNotice, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
            <MaterialCommunityIcons name="information-outline" size={22} color="#B45309" />
            <Text style={[styles.desktopNoticeText, { color: '#92400E' }]}>
              Akun sedang direview. Beberapa fitur operasional belum dapat digunakan.
            </Text>
          </View>
        ) : null}

        <View style={styles.desktopStatsGrid}>
          <DesktopMetricCard label="Anak Aktif" value={childCount} icon="baby-face-outline" color={theme.colors.primary} />
          <DesktopMetricCard label="Orang Tua" value={parentCount} icon="account-group-outline" color={theme.colors.success} />
          <DesktopMetricCard label="Status" value={isApproved ? 'Aktif' : 'Review'} icon="shield-check-outline" color="#0EA5E9" />
        </View>

        <View style={[styles.desktopMainGrid, compact && styles.desktopMainGridCompact]}>
          <View style={styles.desktopMainColumn}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Aksi cepat</Text>
              <Text style={[styles.sectionMeta, { color: theme.colors.textSecondary }]}>Workflow operasional utama</Text>
            </View>

            <View style={styles.actionGrid}>
              <DesktopActionButton
                color={theme.colors.primary}
                icon="clipboard-check-outline"
                label="Daily Care"
                meta="Check-in, check-out, dan aktivitas"
                onPress={() => onNavigate('/(daycare)/daily-care')}
              />
              <DesktopActionButton
                color="#0EA5E9"
                icon="calendar-check"
                label="Jadwal"
                meta="Susun aktivitas anak"
                onPress={() => onNavigate('/(daycare)/(tabs)/activities')}
              />
              <DesktopActionButton
                color={theme.colors.success}
                icon="baby-face-outline"
                label="Data Anak"
                meta="Kelola anak dan keluarga"
                onPress={() => onNavigate('/(daycare)/(tabs)/children')}
              />
              <DesktopActionButton
                color="#F59E0B"
                icon="shape-outline"
                label="Template"
                meta="Pola kegiatan harian"
                onPress={() => onNavigate('/(daycare)/template')}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Anak terbaru</Text>
              <Pressable accessibilityRole="button" onPress={() => onNavigate('/(daycare)/(tabs)/children')}>
                <Text style={[styles.sectionLink, { color: theme.colors.primary }]}>Lihat semua</Text>
              </Pressable>
            </View>

            <View style={[styles.listPanel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              {visibleChildren.length > 0 ? (
                visibleChildren.map((child) => (
                  <DesktopListRow
                    key={child.id}
                    icon="account-child-outline"
                    title={child.profile.name}
                    meta={`${child.profile.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'} · ${child.customData.notes ?? 'Tidak ada catatan'}`}
                  />
                ))
              ) : (
                <DesktopEmptyState label="Belum ada data anak aktif." />
              )}
            </View>
          </View>

          <View style={styles.desktopSideColumn}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Orang tua</Text>
              <Pressable accessibilityRole="button" onPress={() => onNavigate('/(daycare)/(tabs)/children')}>
                <Text style={[styles.sectionLink, { color: theme.colors.primary }]}>Kelola</Text>
              </Pressable>
            </View>

            <View style={[styles.listPanel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              {visibleParents.length > 0 ? (
                visibleParents.map((parent) => (
                  <DesktopListRow
                    key={parent.id}
                    icon="account-outline"
                    title={parent.user.name}
                    meta={parent.user.email}
                  />
                ))
              ) : (
                <DesktopEmptyState label="Belum ada orang tua aktif." />
              )}
            </View>

            <View style={[styles.desktopStatusPanel, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }]}>
              <MaterialCommunityIcons name="shield-check-outline" size={28} color={theme.colors.primary} />
              <Text style={[styles.desktopStatusTitle, { color: theme.colors.textPrimary }]}>Sistem aktif</Text>
              <Text style={[styles.desktopStatusText, { color: theme.colors.textSecondary }]}>
                Data operasional memakai API dan session yang sama dengan mobile.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DesktopMetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  const theme = useAppTheme();

  return (
    <View style={[styles.metricCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.metricTopRow}>
        <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

function DesktopActionButton({
  color,
  icon,
  label,
  meta,
  onPress,
}: {
  color: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  meta: string;
  onPress: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.actionButton}>
      <View style={[styles.actionInner, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={[styles.actionIcon, { backgroundColor: `${color}14` }]}>
          <MaterialCommunityIcons name={icon} size={23} color={color} />
        </View>
        <View style={styles.actionText}>
          <Text style={[styles.actionLabel, { color: theme.colors.textPrimary }]}>{label}</Text>
          <Text style={[styles.actionMeta, { color: theme.colors.textSecondary }]}>{meta}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
      </View>
    </Pressable>
  );
}

function DesktopListRow({
  icon,
  title,
  meta,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  meta: string;
}) {
  const theme = useAppTheme();

  return (
    <View style={[styles.listRow, { borderColor: theme.colors.border }]}>
      <View style={[styles.listIcon, { backgroundColor: '#F8FAFC' }]}>
        <MaterialCommunityIcons name={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.listText}>
        <Text numberOfLines={1} style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
          {title}
        </Text>
        <Text numberOfLines={1} style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          {meta}
        </Text>
      </View>
    </View>
  );
}

function DesktopEmptyState({ label }: { label: string }) {
  const theme = useAppTheme();

  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="database-outline" size={24} color={theme.colors.textSecondary} />
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  desktopRoot: {
    flex: 1,
  },
  desktopScroll: {
    gap: 24,
    padding: 28,
    paddingBottom: 48,
  },
  desktopHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
  },
  desktopHeaderCompact: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  desktopHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  desktopEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  desktopTitle: {
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 42,
    marginTop: 4,
  },
  desktopSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    maxWidth: 620,
    marginTop: 4,
  },
  desktopUserPanel: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minWidth: 220,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  statusDot: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  desktopUserText: {
    flex: 1,
    minWidth: 0,
  },
  desktopUserName: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  desktopUserMeta: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  desktopNotice: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 14,
  },
  desktopNoticeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  desktopStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  metricCard: {
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    minWidth: 190,
    padding: 18,
  },
  metricTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
    marginTop: 12,
  },
  desktopMainGrid: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 22,
  },
  desktopMainGridCompact: {
    flexDirection: 'column',
  },
  desktopMainColumn: {
    flex: 1,
    gap: 16,
    minWidth: 0,
  },
  desktopSideColumn: {
    gap: 16,
    maxWidth: 390,
    minWidth: 320,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  sectionMeta: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flexGrow: 1,
    minWidth: 260,
  },
  actionInner: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 74,
    padding: 14,
  },
  actionIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  actionText: {
    flex: 1,
    minWidth: 0,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },
  actionMeta: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    marginTop: 2,
  },
  listPanel: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  listRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 14,
  },
  listIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  listText: {
    flex: 1,
    minWidth: 0,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  listMeta: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    minHeight: 120,
    justifyContent: 'center',
    padding: 18,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'center',
  },
  desktopStatusPanel: {
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  desktopStatusTitle: {
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  desktopStatusText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
});
