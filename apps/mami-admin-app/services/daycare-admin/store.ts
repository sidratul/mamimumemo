import { gql } from '@apollo/client';

import { apolloClient } from '../apollo';

export type ApprovalStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'NEEDS_REVISION'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export type DaycareApprovalHistory = {
  status: ApprovalStatus;
  note: string;
  changedBy: string;
  changedAt: string;
};

export type AdminDaycare = {
  id: string;
  name: string;
  lid: string;
  ownerName: string;
  ownerEmail: string;
  city: string;
  address?: string;
  description?: string;
  submittedAt: string;
  approvedAt?: string;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  approvalNote?: string;
  legalDocuments: Array<{
    type: string;
    url: string;
    verified: boolean;
  }>;
  history: DaycareApprovalHistory[];
};

type ListDaycaresInput = {
  status?: ApprovalStatus | 'ALL';
  search?: string;
};

type SystemDaycaresResponse = {
  systemDaycares: {
    items: DaycareApiNode[];
    total: number;
  };
};

type SystemDaycareResponse = {
  systemDaycare: DaycareApiNode | null;
};

type UpdateDaycareApprovalStatusResponse = {
  updateDaycareApprovalStatus: DaycareApiNode;
};

type DaycareApiNode = {
  id: string;
  name: string;
  lid: string;
  ownerName: string;
  ownerEmail: string;
  city: string;
  address?: string | null;
  description?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  approvalNote?: string | null;
  legalDocuments?: Array<{
    type: string;
    url: string;
    verified: boolean;
  }> | null;
  approval?: {
    history?: Array<{
      status: ApprovalStatus;
      note?: string | null;
      changedAt: string;
      changedBy?: {
        name: string;
      } | null;
    }> | null;
  } | null;
};

const SYSTEM_DAYCARE_FIELDS = gql`
  fragment SystemDaycareFields on Daycare {
    id
    name
    lid
    ownerName
    ownerEmail
    city
    address
    description
    submittedAt
    approvedAt
    approvalStatus
    isActive
    approvalNote
    legalDocuments {
      type
      url
      verified
    }
    approval {
      history {
        status
        note
        changedAt
        changedBy {
          name
        }
      }
    }
  }
`;

const LIST_SYSTEM_DAYCARES_QUERY = gql`
  query ListSystemDaycares($status: DaycareApprovalStatus, $search: String, $limit: Int, $offset: Int) {
    systemDaycares(status: $status, search: $search, limit: $limit, offset: $offset) {
      total
      items {
        ...SystemDaycareFields
      }
    }
  }
  ${SYSTEM_DAYCARE_FIELDS}
`;

const GET_SYSTEM_DAYCARE_QUERY = gql`
  query GetSystemDaycare($id: ObjectId!) {
    systemDaycare(id: $id) {
      ...SystemDaycareFields
    }
  }
  ${SYSTEM_DAYCARE_FIELDS}
`;

const UPDATE_DAYCARE_APPROVAL_STATUS_MUTATION = gql`
  mutation UpdateDaycareApprovalStatus($id: ObjectId!, $input: UpdateDaycareApprovalInput!) {
    updateDaycareApprovalStatus(id: $id, input: $input) {
      ...SystemDaycareFields
    }
  }
  ${SYSTEM_DAYCARE_FIELDS}
`;

const statusLabelMap: Record<ApprovalStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  IN_REVIEW: 'In Review',
  NEEDS_REVISION: 'Needs Revision',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SUSPENDED: 'Suspended',
};

const allowedNextStatuses: Record<ApprovalStatus, ApprovalStatus[]> = {
  DRAFT: [],
  SUBMITTED: ['IN_REVIEW'],
  IN_REVIEW: ['APPROVED', 'NEEDS_REVISION', 'REJECTED'],
  NEEDS_REVISION: [],
  APPROVED: ['SUSPENDED'],
  REJECTED: [],
  SUSPENDED: ['APPROVED'],
};

function mapDaycare(node: DaycareApiNode): AdminDaycare {
  return {
    id: node.id,
    name: node.name,
    lid: node.lid,
    ownerName: node.ownerName,
    ownerEmail: node.ownerEmail,
    city: node.city,
    address: node.address ?? '',
    description: node.description ?? '',
    submittedAt: node.submittedAt ?? '',
    approvedAt: node.approvedAt ?? '',
    approvalStatus: node.approvalStatus,
    isActive: node.isActive,
    approvalNote: node.approvalNote ?? '',
    legalDocuments: node.legalDocuments ?? [],
    history: (node.approval?.history ?? []).map((item) => ({
      status: item.status,
      note: item.note ?? '',
      changedBy: item.changedBy?.name ?? 'System',
      changedAt: item.changedAt,
    })),
  };
}

export function getApprovalStatusLabel(status: ApprovalStatus) {
  return statusLabelMap[status];
}

export function getAvailableApprovalStatusOptions(status: ApprovalStatus) {
  return allowedNextStatuses[status].map((value) => ({
    label: statusLabelMap[value],
    value,
  }));
}

export async function listSystemDaycares({ status = 'ALL', search = '' }: ListDaycaresInput = {}) {
  const response = await apolloClient.query<SystemDaycaresResponse>({
    query: LIST_SYSTEM_DAYCARES_QUERY,
    variables: {
      status: status === 'ALL' ? undefined : status,
      search: search.trim() || undefined,
      limit: 50,
      offset: 0,
    },
    fetchPolicy: 'network-only',
  });

  return response.data.systemDaycares.items.map(mapDaycare);
}

export async function getSystemDaycareById(id: string) {
  const response = await apolloClient.query<SystemDaycareResponse>({
    query: GET_SYSTEM_DAYCARE_QUERY,
    variables: { id },
    fetchPolicy: 'network-only',
  });

  const daycare = response.data.systemDaycare;
  return daycare ? mapDaycare(daycare) : null;
}

export async function updateSystemDaycareApprovalStatus(id: string, status: ApprovalStatus, note: string) {
  const response = await apolloClient.mutate<UpdateDaycareApprovalStatusResponse>({
    mutation: UPDATE_DAYCARE_APPROVAL_STATUS_MUTATION,
    variables: {
      id,
      input: {
        status,
        note,
      },
    },
  });

  const updated = response.data?.updateDaycareApprovalStatus;
  if (!updated) {
    throw new Error('Failed to update daycare approval status');
  }

  return mapDaycare(updated);
}
