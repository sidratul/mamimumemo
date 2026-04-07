import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import type { ComponentProps } from 'react';
import type { DimensionValue } from 'react-native';

import { listDaycares, type AdminDaycare } from '../../services/daycare-admin';
import { Box, Text } from '../../theme/theme';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

function toPercentWidth(value: number): DimensionValue {
  return `${value}%` as DimensionValue;
}

function SummaryCard({
  title,
  value,
  note,
  icon,
}: {
  title: string;
  value: string;
  note: string;
  icon: MaterialIconName;
}) {
  return (
    <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="xs">
      <Box flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text variant="cardTitle">{title}</Text>
        <MaterialIcons name={icon} size={18} color="#E23A8A" />
      </Box>
      <Text variant="cardValue">{value}</Text>
      <Text color="textSecondary">{note}</Text>
    </Box>
  );
}

function ChartRow({
  label,
  value,
  width,
  color,
}: {
  label: string;
  value: string;
  width: DimensionValue;
  color: string;
}) {
  return (
    <Box gap="xs">
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text>{label}</Text>
        <Text style={{ fontWeight: '700', color }}>{value}</Text>
      </Box>
      <Box height={10} borderRadius="md" style={{ backgroundColor: '#FCE7F3', overflow: 'hidden' }}>
        <Box height={10} borderRadius="md" style={{ width, backgroundColor: color }} />
      </Box>
    </Box>
  );
}

function QuickAction({
  icon,
  label,
  value,
  onPress,
}: {
  icon: MaterialIconName;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Box
        flex={1}
        backgroundColor="surface"
        borderRadius="md"
        borderWidth={1}
        borderColor="border"
        padding="lg"
        gap="xs"
        minWidth={150}>
        <Box
          width={36}
          height={36}
          borderRadius="md"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: '#FCE7F3' }}>
          <MaterialIcons name={icon} size={18} color="#E23A8A" />
        </Box>
        <Text style={{ fontWeight: '700' }}>{label}</Text>
        <Text color="textSecondary">{value}</Text>
      </Box>
    </Pressable>
  );
}

export function DashboardContainer() {
  const router = useRouter();
  const [items, setItems] = useState<AdminDaycare[]>([]);
  const [loading, setLoading] = useState(true);

  const metrics = useMemo(() => {
    const submitted = items.filter((item) => item.approvalStatus === 'SUBMITTED').length;
    const inReview = items.filter((item) => item.approvalStatus === 'IN_REVIEW').length;
    const approved = items.filter((item) => item.approvalStatus === 'APPROVED').length;
    const revision = items.filter((item) => item.approvalStatus === 'NEEDS_REVISION').length;
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
      const data = await listDaycares();
      setItems(data);
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Box flex={1} backgroundColor="background" padding="xl" gap="lg" paddingTop="xxl">
        <Box backgroundColor="primary" borderRadius="lg" padding="lg" gap="sm">
          <Text style={{ color: '#FBCFE8', fontSize: 13 }}>Admin System</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '700' }}>Dashboard</Text>
          <Text style={{ color: '#FCE7F3', fontSize: 15 }}>Pantau antrean approval daycare dan progres review hari ini.</Text>
        </Box>

        <Box gap="md">
          <SummaryCard
            title="Submitted"
            value={loading ? '...' : String(metrics.submitted)}
            note="Menunggu mulai direview"
            icon="mark-email-unread"
          />
          <SummaryCard
            title="In Review"
            value={loading ? '...' : String(metrics.inReview)}
            note="Sedang diproses admin"
            icon="fact-check"
          />
          <SummaryCard
            title="Approved"
            value={loading ? '...' : String(metrics.approved)}
            note="Sudah aktif"
            icon="verified-user"
          />
        </Box>

        <Box backgroundColor="surface" borderRadius="lg" borderWidth={1} borderColor="border" padding="lg" gap="md">
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text variant="cardValue">Approval Chart</Text>
            <MaterialIcons name="bar-chart" size={20} color="#E23A8A" />
          </Box>
          <ChartRow label="Submitted" value={loading ? '...' : String(metrics.submitted)} width={metrics.submittedWidth} color="#E23A8A" />
          <ChartRow label="In Review" value={loading ? '...' : String(metrics.inReview)} width={metrics.inReviewWidth} color="#F59E0B" />
          <ChartRow label="Approved" value={loading ? '...' : String(metrics.approved)} width={metrics.approvedWidth} color="#1F9D63" />
          <ChartRow label="Needs Revision" value={loading ? '...' : String(metrics.revision)} width={metrics.revisionWidth} color="#C6285A" />
        </Box>

        <Box gap="sm">
          <Text variant="cardValue">Quick Action</Text>
          <Box flexDirection="row" gap="sm" flexWrap="wrap">
            <QuickAction
              icon="schedule"
              label="Perlu Review"
              value={loading ? 'Memuat...' : `${metrics.submitted} daycare`}
              onPress={() => router.push({ pathname: '/(app)/(tabs)/daycares', params: { status: 'SUBMITTED' } })}
            />
            <QuickAction
              icon="fact-check"
              label="Sedang Direview"
              value={loading ? 'Memuat...' : `${metrics.inReview} daycare`}
              onPress={() => router.push({ pathname: '/(app)/(tabs)/daycares', params: { status: 'IN_REVIEW' } })}
            />
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
}
