import { Button } from 'react-native-paper';
import { ListFilterBar } from '@mami/ui';

import { type UserPersona } from '../../services/users';
import { Box, Text } from '../../theme/theme';

type UserListHeaderProps = {
  persona: UserPersona | 'ALL';
  search: string;
  onChangePersona: (value: UserPersona | 'ALL') => void;
  onChangeSearch: (value: string) => void;
  onPressAdd: () => void;
};

const personaOptions: Array<{ label: string; value: UserPersona | 'ALL' }> = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Parent', value: 'PARENT' },
  { label: 'Owner', value: 'OWNER' },
  { label: 'Admin', value: 'DAYCARE_ADMIN' },
  { label: 'Sitter', value: 'DAYCARE_SITTER' },
];

export function UserListHeader({
  persona,
  search,
  onChangePersona,
  onChangeSearch,
  onPressAdd,
}: UserListHeaderProps) {
  return (
    <Box gap="lg" paddingTop="md" paddingBottom="sm">
      <Box paddingHorizontal="lg" gap="xs">
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="md">
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#24324B' }}>Users</Text>
          <Button
            mode="contained"
            compact
            icon="plus"
            onPress={onPressAdd}
            contentStyle={{ height: 36, alignItems: 'center', justifyContent: 'center' }}
            labelStyle={{ marginVertical: 0, lineHeight: 16 }}
            style={{ borderRadius: 10 }}>
            Tambah
          </Button>
        </Box>
        <Text color="textSecondary">Kelola akun utama dan persona yang dimiliki setiap user.</Text>
      </Box>

      <ListFilterBar
        searchPlaceholder="Cari nama atau email user"
        searchValue={search}
        onSearchChange={onChangeSearch}
        options={personaOptions}
        selectedValue={persona}
        onSelect={(value) => onChangePersona(value as UserPersona | 'ALL')}
      />
    </Box>
  );
}
