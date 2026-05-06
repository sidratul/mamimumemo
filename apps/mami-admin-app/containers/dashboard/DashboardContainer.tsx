import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { listDaycares } from '../../services/daycare';
import { DaycareRecord } from '../../shared/daycare/types';
import { Box, useAppTheme } from '../../theme/theme';
import { DashboardChartSection } from './DashboardChartSection';
import { DashboardHeaderSection } from './DashboardHeaderSection';
import { DashboardQuickActionsSection } from './DashboardQuickActionsSection';
import { DashboardSummarySection } from './DashboardSummarySection';
import { toPercentWidth } from './dashboard.utils';

export function DashboardContainer() {
  const router = useRouter();
  const theme = useAppTheme();
  const [items, setItems] = useState<DaycareRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const metrics = useMemo(() => {
    const submitted = items.filter((item) => item.approval?.status === 'SUBMITTED').length;
    const inReview = items.filter((item) => item.approval?.status === 'IN_REVIEW').length;
    const approved = items.filter((item) => item.approval?.status === 'APPROVED').length;
    const revision = items.filter((item) => item.approval?.status === 'NEEDS_REVISION').length;
    const total = Math.max(items.length, 1);

    return {
      submitted,
      inReview,
      approved,
      revision,
      submittedWidth: toPercentWidth(Math.max((submitted / total) * 100, submitted ? 12 : 0)),
      inReviewWidth: toPercentWidth(Math.max((inReview / total) * 100, inReview ? 12 : 0)),
      approvedWidth: toPercentWidth(Math.max((approved / total) * 100, approved ? 12 : 0)),
      revisionWidth: toPercentWidth(Math.max((revision / total) * 100, revision ? 12 : 0)),
    };
  }, [items]);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listDaycares();
      setItems(res.items);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadDashboard();
    }, [loadDashboard])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box flex={1} backgroundColor="background" padding="lg" gap="lg" paddingTop="md">
          <DashboardHeaderSection />
          <DashboardSummarySection
            loading={loading}
            submitted={metrics.submitted}
            inReview={metrics.inReview}
            approved={metrics.approved}
          />
          <DashboardChartSection
            loading={loading}
            submitted={metrics.submitted}
            submittedWidth={metrics.submittedWidth}
            inReview={metrics.inReview}
            inReviewWidth={metrics.inReviewWidth}
            approved={metrics.approved}
            approvedWidth={metrics.approvedWidth}
            revision={metrics.revision}
            revisionWidth={metrics.revisionWidth}
            primaryColor={theme.colors.primary}
            successColor={theme.colors.success}
          />
          <DashboardQuickActionsSection
            loading={loading}
            submitted={metrics.submitted}
            inReview={metrics.inReview}
            onPressSubmitted={() => router.push({ pathname: '/(app)/(tabs)/daycares', params: { status: 'SUBMITTED' } })}
            onPressInReview={() => router.push({ pathname: '/(app)/(tabs)/daycares', params: { status: 'IN_REVIEW' } })}
          />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
