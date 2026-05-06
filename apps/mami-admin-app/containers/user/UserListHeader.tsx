import { Button } from '@mami/ui';
import { ListFilterBar } from '@mami/ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { type UserAccess } from '../../shared/user/types';
import { Box, Text } from '../../theme/theme';

type UserListHeaderProps = {
  access: UserAccess | 'ALL';
  search: string;
  onChangeAccess: (value: UserAccess | 'ALL') => void;
  onChangeSearch: (value: string) => void;
  onPressAdd: () => void;
};

const accessOptions: { label: string; value: UserAccess | 'ALL' }[] = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Parent', value: 'PARENT' },
  { label: 'Owner', value: 'OWNER' },
  { label: 'Admin', value: 'DAYCARE_ADMIN' },
  { label: 'Sitter', value: 'DAYCARE_SITTER' },
];

export function UserListHeader({
  access,
  search,
  onChangeAccess,
  onChangeSearch,
  onPressAdd,
}: UserListHeaderProps) {
  return (
    <Box gap="lg" paddingTop="md" paddingBottom="sm">
      <Box paddingHorizontal="lg" gap="xs">
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap="md">
          <Text variant="title" fontSize={24} flex={1}>Pengguna</Text>
          <Button
            label="Tambah User"
            onPress={onPressAdd}
            variant="primary"
            icon={<MaterialIcons name="add" size={18} color="#FFFFFF" />}
            style={{ paddingHorizontal: 16, height: 40, borderRadius: 12 }}
          />
        </Box>
        <Text variant="subtitle">Kelola akun utama dan daftar akses yang dimiliki setiap user.</Text>
      </Box>

      <ListFilterBar
        searchPlaceholder="Cari nama atau email user"
        searchValue={search}
        onSearchChange={onChangeSearch}
        options={accessOptions}
        selectedValue={access}
        onSelect={(value) => onChangeAccess(value as UserAccess | 'ALL')}
      />
    </Box>
  );
}
