export type ModuleDefinition = {
  slug: string;
  title: string;
  description: string;
  route: string;
};

export const moduleDefinitions: ModuleDefinition[] = [
  {
    slug: 'daycare-approval',
    title: 'Daycare Approval',
    description: 'List daycare global + approval pendaftaran oleh system admin.',
    route: '/(app)/daycares',
  },
  {
    slug: 'role-access',
    title: 'Role & Access',
    description: 'Monitoring role user system-level dan access policy.',
    route: '/(app)/modules/role-access',
  },
  {
    slug: 'audit-log',
    title: 'Audit Log',
    description: 'Tracking perubahan status approval dan aksi admin.',
    route: '/(app)/modules/audit-log',
  },
  {
    slug: 'system-settings',
    title: 'System Settings',
    description: 'Pengaturan global aplikasi dan konfigurasi system admin.',
    route: '/(app)/(tabs)/settings',
  },
];

export function getModuleDefinition(slug: string) {
  return moduleDefinitions.find((moduleDef) => moduleDef.slug === slug);
}
