export type DaycareRegistrationStatus = {
  id: string;
  name: string;
  city: string;
  isActive: boolean;
  approvalStatus: 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'NEEDS_REVISION' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  approvalNote?: string;
  submittedAt?: string;
  approvedAt?: string;
};

export async function getMyDaycareRegistration(token: string) {
  // MOCK LOGIC for "dummy dulu"
  if (token.startsWith('dummy-token-')) {
    return {
      id: 'dummy-daycare-id',
      name: 'Daycare Ceria Dummy',
      city: 'Jakarta',
      isActive: true,
      approvalStatus: 'APPROVED' as const,
      approvalNote: 'Data dummy untuk pengembangan desain.',
      submittedAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
    };
  }

  console.log('[RegistrationStatus] myDaycareRegistration skipped: query is disabled in current backend.');
  return null;
}
