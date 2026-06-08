import { Box, Text, useAppTheme } from '../../../theme/theme';
import { Screen } from '@mami/ui';

export default function DaycareChildrenScreen() {
  const theme = useAppTheme();
  
  return (
    <Screen title="Daftar Anak" subtitle="Kelola data anak dan enrollment.">
      <Box 
        backgroundColor="surface" 
        padding="xl" 
        borderRadius="xl" 
        alignItems="center" 
        style={{ marginTop: 40, borderStyle: 'dashed', borderWidth: 2, borderColor: theme.colors.border }}
      >
        <Text color="textSecondary" fontWeight="700">Data Anak Sedang Disiapkan</Text>
      </Box>
    </Screen>
  );
}
