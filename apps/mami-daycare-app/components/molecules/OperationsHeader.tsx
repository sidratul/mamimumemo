import { Box, Text } from '../../theme/theme';

type OperationsHeaderProps = {
  title: string;
  subtitle: string;
};

export function OperationsHeader({ title, subtitle }: OperationsHeaderProps) {
  return (
    <Box gap="xs">
      <Text variant="title">{title}</Text>
      <Text variant="subtitle">{subtitle}</Text>
    </Box>
  );
}
