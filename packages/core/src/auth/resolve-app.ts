import { appRoleMap, type UserRole } from '../constants/roles';

export type TargetApp = 'admin' | 'owner' | 'daycare' | 'parent';

export function resolveAvailableApps(roles: UserRole[]): TargetApp[] {
  const normalized = new Set(roles);

  const availableApps = (Object.keys(appRoleMap) as TargetApp[]).filter((appKey) =>
    appRoleMap[appKey].some((role) => normalized.has(role))
  );

  return availableApps;
}
