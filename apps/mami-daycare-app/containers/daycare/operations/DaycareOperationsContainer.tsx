import { useEffect, useState, useCallback } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useSession } from '../../../providers/session-provider';
import {
  getDaycareRoster,
  type DaycareChild,
  type DaycareParent,
} from '../../../services/registration';
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
  const [status] = useState<string>('APPROVED');
  const [parents, setParents] = useState<DaycareParent[]>([]);
  const [children, setChildren] = useState<DaycareChild[]>([]);
  const [loading, setLoading] = useState(true);

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
      try {
        setLoading(true);
        await loadData(session);
      } finally {
        setLoading(false);
      }
    })();
  }, [session, loadData]);

  if (isLoading) return null;
  if (!session) return <Redirect href="/(auth)/login" />;

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
