import { Box, Text } from '../../theme/theme';

export function DashboardHeaderSection() {
  return (
    <Box gap="xs" marginBottom="sm">
      <Text variant="title">Ringkasan</Text>
      <Text variant="subtitle">Pantau antrean approval daycare dan progres review hari ini.</Text>
    </Box>
  );
}
