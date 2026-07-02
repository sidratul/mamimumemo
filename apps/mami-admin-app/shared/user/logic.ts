import { UserRecord, SystemRoleSelection } from './types';

export function mapUser(node: UserRecord): UserRecord {
  return node;
}

export function getSystemRoleLabel(role: SystemRoleSelection) {
  return role === 'SUPER_ADMIN' ? 'Super Admin' : 'Tidak ada akses sistem';
}
