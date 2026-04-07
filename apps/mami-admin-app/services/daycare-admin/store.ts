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
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
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

type DaycaresResponse = {
  daycares: DaycareApiNode[];
};

type DaycareCountResponse = {
  daycareCount: number;
};

type DaycareDetailResponse = {
  daycare: DaycareApiNode | null;
};

type UpdateDaycareApprovalStatusResponse = {
  updateDaycareApprovalStatus: {
    id: string;
    message: string;
  };
};

type DaycareApiNode = {
  _id: string;
  name: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  city: string;
  address?: string | null;
  description?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  isActive: boolean;
  legalDocuments?: Array<{
    type: string;
    url: string;
    verified: boolean;
  }> | null;
  approval?: {
    status?: ApprovalStatus;
    note?: string | null;
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

const DAYCARE_FIELDS = gql`
  fragment DaycareFields on Daycare {
    _id
    name
    owner {
      _id
      name
      email
      phone
    }
    city
    address
    description
    submittedAt
    approvedAt
    isActive
    legalDocuments {
      type
      url
      verified
    }
    approval {
      status
      note
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

const LIST_DAYCARES_QUERY = gql`
  query ListDaycares($filter: DaycareFilterInput, $sort: SortInput, $pagination: PaginationInput) {
    daycares(filter: $filter, sort: $sort, pagination: $pagination) {
      ...DaycareFields
    }
  }
  ${DAYCARE_FIELDS}
`;

const DAYCARE_COUNT_QUERY = gql`
  query DaycareCount($filter: DaycareFilterInput) {
    daycareCount(filter: $filter)
  }
`;

const GET_DAYCARE_QUERY = gql`
  query GetDaycare($id: ObjectId!) {
    daycare(id: $id) {
      ...DaycareFields
    }
  }
  ${DAYCARE_FIELDS}
`;

const UPDATE_DAYCARE_APPROVAL_STATUS_MUTATION = gql`
  mutation UpdateDaycareApprovalStatus($id: ObjectId!, $input: UpdateDaycareApprovalInput!) {
    updateDaycareApprovalStatus(id: $id, input: $input) {
      id
      message
    }
  }
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
    id: node._id,
    name: node.name,
    owner: {
      id: node.owner._id,
      name: node.owner.name,
      email: node.owner.email,
      phone: node.owner.phone ?? '',
    },
    city: node.city,
    address: node.address ?? '',
    description: node.description ?? '',
    submittedAt: node.submittedAt ?? '',
    approvedAt: node.approvedAt ?? '',
    approvalStatus: node.approval?.status ?? 'DRAFT',
    isActive: node.isActive,
    approvalNote: node.approval?.note ?? '',
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

export function getApprovalStatusHelperText(status: ApprovalStatus) {
  switch (status) {
    case 'IN_REVIEW':
      return 'Pindahkan daycare ke tahap review aktif oleh admin.';
    case 'APPROVED':
      return 'Aktifkan daycare dan izinkan operasional berjalan.';
    case 'NEEDS_REVISION':
      return 'Minta owner melengkapi atau memperbaiki data pendaftaran.';
    case 'REJECTED':
      return 'Tolak pendaftaran daycare secara final.';
    case 'SUSPENDED':
      return 'Nonaktifkan daycare yang sebelumnya sudah approved.';
    default:
      return '';
  }
}

export async function listDaycares({ status = 'ALL', search = '' }: ListDaycaresInput = {}) {
  const response = await apolloClient.query<DaycaresResponse>({
    query: LIST_DAYCARES_QUERY,
    variables: {
      filter: {
        statuses: status === 'ALL' ? undefined : [status],
        search: search.trim() || undefined,
      },
      sort: {
        sortBy: 'createdAt',
        sortType: 'DESC',
      },
      pagination: {
        page: 1,
        limit: 50,
      },
    },
    fetchPolicy: 'network-only',
  });

  return response.data.daycares.map(mapDaycare);
}

export async function getDaycareCount({ status = 'ALL', search = '' }: ListDaycaresInput = {}) {
  const response = await apolloClient.query<DaycareCountResponse>({
    query: DAYCARE_COUNT_QUERY,
    variables: {
      filter: {
        statuses: status === 'ALL' ? undefined : [status],
        search: search.trim() || undefined,
      },
    },
    fetchPolicy: 'network-only',
  });

  return response.data.daycareCount;
}

export async function getDaycareById(id: string) {
  const response = await apolloClient.query<DaycareDetailResponse>({
    query: GET_DAYCARE_QUERY,
    variables: { id },
    fetchPolicy: 'network-only',
  });

  const daycare = response.data.daycare;
  return daycare ? mapDaycare(daycare) : null;
}

export async function updateDaycareApprovalStatus(id: string, status: ApprovalStatus, note: string) {
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

  const refreshed = await getDaycareById(updated.id);
  if (!refreshed) {
    throw new Error(updated.message || 'Failed to reload daycare after status update');
  }

  return refreshed;
}
