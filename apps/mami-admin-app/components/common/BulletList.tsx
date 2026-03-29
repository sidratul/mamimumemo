import { Box, Text } from '../../theme/theme';

type BulletListProps = {
  items: string[];
};

export function BulletList({ items }: BulletListProps) {
  return (
    <Box gap="xs">
      {items.map((item) => (
        <Text key={item}>• {item}</Text>
      ))}
    </Box>
  );
}
