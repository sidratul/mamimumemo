import { getUserRoleLabel as getSharedUserRoleLabel } from '@mami/core';
import { UserRecord, UserRole } from './types';

export function mapUser(node: UserRecord): UserRecord {
  return node;
}

export function getUserRoleLabel(role: UserRole) {
  return getSharedUserRoleLabel(role as any);
}
