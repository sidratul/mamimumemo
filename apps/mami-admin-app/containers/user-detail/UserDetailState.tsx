import { ActivityIndicator } from 'react-native-paper';
import { DetailScreen } from '@mami/ui';

import { Box, Text } from '../../theme/theme';

type UserDetailStateProps =
  | {
      type: 'loading';
    }
  | {
      type: 'error';
      message: string;
    };

export function UserDetailState(props: UserDetailStateProps) {
  return (
    <DetailScreen title="Detail User" scrollable={false}>
      <Box
        backgroundColor="surface"
        borderColor="border"
        borderWidth={1}
        borderRadius="lg"
        padding="xl"
        gap="sm"
        marginTop="xxl"
        alignItems={props.type === 'loading' ? 'center' : undefined}>
        {props.type === 'loading' ? (
          <>
            <ActivityIndicator color="#4D96FF" />
            <Text color="textSecondary">Memuat detail user...</Text>
          </>
        ) : (
          <>
            <Text color="danger" style={{ fontWeight: '700' }}>
              Detail user tidak tersedia
            </Text>
            <Text color="textSecondary">{props.message}</Text>
          </>
        )}
      </Box>
    </DetailScreen>
  );
}
