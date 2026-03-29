import type { UserRole } from '../constants/roles';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
};

export type SessionState = {
  token: string | null;
  user: SessionUser | null;
  activeRole: UserRole | null;
  activeDaycareId: string | null;
};
