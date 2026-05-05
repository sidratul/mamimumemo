import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { type ComponentProps } from 'react';
import { ActionTile } from '@mami/ui';

import { Box, Text } from '../../theme/theme';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

function QuickAction({
  icon,
  label,
  value,
  onPress,
  iconColor,
  iconBackground,
}: {
  icon: MaterialIconName;
  label: string;
  value: string;
  onPress: () => void;
  iconColor: string;
  iconBackground: string;
}) {
  return (
    <ActionTile
      title={label}
      description={value}
      onPress={onPress}
      contentContainerStyle={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F1F5F9',
      }}
      icon={
        <Box
          width={40}
          height={40}
          borderRadius="md"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: iconBackground }}>
          <MaterialIcons name={icon} size={20} color={iconColor} />
        </Box>
      }
    />
  );
}

type DashboardQuickActionsSectionProps = {
  loading: boolean;
  submitted: number;
  inReview: number;
  onPressSubmitted: () => void;
  onPressInReview: () => void;
};

export function DashboardQuickActionsSection({
  loading,
  submitted,
  inReview,
  onPressSubmitted,
  onPressInReview,
}: DashboardQuickActionsSectionProps) {
  return (
    <Box gap="md" marginTop="sm">
      <Text variant="cardTitle">Aksi Cepat</Text>
      <Box flexDirection="row" gap="md" flexWrap="wrap">
        <Box flex={1} minWidth={150}>
          <QuickAction
            icon="schedule"
            label="Perlu Review"
            value={loading ? 'Memuat...' : `${submitted} daycare`}
            onPress={onPressSubmitted}
            iconColor="#6366F1"
            iconBackground="#EEF2FF"
          />
        </Box>
        <Box flex={1} minWidth={150}>
          <QuickAction
            icon="fact-check"
            label="Sedang Direview"
            value={loading ? 'Memuat...' : `${inReview} daycare`}
            onPress={onPressInReview}
            iconColor="#F59E0B"
            iconBackground="#FFFBEB"
          />
        </Box>
      </Box>
    </Box>
  );
}
