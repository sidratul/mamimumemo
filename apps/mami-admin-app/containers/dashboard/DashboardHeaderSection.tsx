import { Box, Text } from '../../theme/theme';

export function DashboardHeaderSection() {
  return (
    <Box gap="xs">
      <Text style={{ color: '#24324B', fontSize: 20, fontWeight: '700' }}>Dashboard</Text>
      <Text color="textSecondary">Pantau antrean approval daycare dan progres review hari ini.</Text>
    </Box>
  );
}
