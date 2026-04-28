import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable } from 'react-native';
import { type ComponentProps } from 'react';

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
          style={{ backgroundColor: iconBackground }}>
          <MaterialIcons name={icon} size={18} color={iconColor} />
        </Box>
        <Text style={{ fontWeight: '700' }}>{label}</Text>
        <Text color="textSecondary">{value}</Text>
      </Box>
    </Pressable>
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
    <Box gap="sm">
      <Text variant="cardValue">Quick Action</Text>
      <Box flexDirection="row" gap="sm" flexWrap="wrap">
        <QuickAction
          icon="schedule"
          label="Perlu Review"
          value={loading ? 'Memuat...' : `${submitted} daycare`}
          onPress={onPressSubmitted}
          iconColor="#4D96FF"
          iconBackground="#E7F0FF"
        />
        <QuickAction
          icon="fact-check"
          label="Sedang Direview"
          value={loading ? 'Memuat...' : `${inReview} daycare`}
          onPress={onPressInReview}
          iconColor="#F5A623"
          iconBackground="#FFF1DB"
        />
      </Box>
    </Box>
  );
}
