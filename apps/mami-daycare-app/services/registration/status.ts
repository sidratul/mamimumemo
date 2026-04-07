import { graphqlRequest } from '../graphql/client';

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

type MyDaycareRegistrationResponse = {
  myDaycareRegistration: {
    id: string;
    name: string;
    city: string;
    isActive: boolean;
    approvalStatus: DaycareRegistrationStatus['approvalStatus'];
    approvalNote?: string | null;
    submittedAt?: string | null;
    approvedAt?: string | null;
  } | null;
};

const MY_DAYCARE_REGISTRATION_QUERY = `
  query MyDaycareRegistration {
    myDaycareRegistration {
      id
      name
      city
      isActive
      approvalStatus
      approvalNote
      submittedAt
      approvedAt
    }
  }
`;

export async function getMyDaycareRegistration(token: string) {
  const result = await graphqlRequest<MyDaycareRegistrationResponse>(MY_DAYCARE_REGISTRATION_QUERY, undefined, token);
  const daycare = result.myDaycareRegistration;

  if (!daycare) {
    return null;
  }

  return {
    id: daycare.id,
    name: daycare.name,
    city: daycare.city,
    isActive: daycare.isActive,
    approvalStatus: daycare.approvalStatus,
    approvalNote: daycare.approvalNote ?? '',
    submittedAt: daycare.submittedAt ?? '',
    approvedAt: daycare.approvedAt ?? '',
  } satisfies DaycareRegistrationStatus;
}
