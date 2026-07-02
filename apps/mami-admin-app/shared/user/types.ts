export type SystemRole = 'SUPER_ADMIN';
export type SystemRoleSelection = SystemRole | 'NONE';

export type UserAccess =
  | 'SUPER_ADMIN'
  | 'PARENT'
  | 'OWNER'
  | 'DAYCARE_ADMIN'
  | 'DAYCARE_SITTER';

export type UserDaycareMembership = {
  _id: string;
  access: 'OWNER' | 'ADMIN' | 'SITTER';
  status: 'ACTIVE' | 'INACTIVE';
  joinedAt?: string | null;
  endedAt?: string | null;
  notes?: string | null;
  daycare: {
    _id: string;
    name: string;
  };
};

export type UserRecord = {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  systemRole?: SystemRole | null;
  accesses: UserAccess[];
  createdAt?: string | null;
  updatedAt?: string | null;
};
