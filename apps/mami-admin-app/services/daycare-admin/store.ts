import { gql } from '@apollo/client';
import { getApprovalStatusLabel as getSharedApprovalStatusLabel } from '@mami/core';

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
  logoUrl?: string;
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
  statusChangedAt: string;
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
  page?: number;
  limit?: number;
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

type UpdateDaycareDocumentsResponse = {
  updateDaycareDocuments: {
    id: string;
    message: string;
  };
};

type RegisterDaycareResponse = {
  registerDaycare: {
    id: string;
    message: string;
  };
};

type DaycareApiNode = {
  _id: string;
  name: string;
  logoUrl?: string | null;
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
    logoUrl
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

const UPDATE_DAYCARE_DOCUMENTS_MUTATION = gql`
  mutation UpdateDaycareDocuments($id: ObjectId!, $input: UpdateDaycareDocumentsInput!) {
    updateDaycareDocuments(id: $id, input: $input) {
      id
      message
    }
  }
`;

const REGISTER_DAYCARE_MUTATION = gql`
  mutation RegisterDaycare($input: RegisterDaycareInput!) {
    registerDaycare(input: $input) {
      id
      message
    }
  }
`;

const allowedNextStatuses: Record<ApprovalStatus, ApprovalStatus[]> = {
  DRAFT: [],
  SUBMITTED: ['IN_REVIEW'],
  IN_REVIEW: ['SUBMITTED', 'APPROVED', 'NEEDS_REVISION', 'REJECTED'],
  NEEDS_REVISION: ['IN_REVIEW'],
  APPROVED: ['IN_REVIEW', 'SUSPENDED'],
  REJECTED: ['IN_REVIEW'],
  SUSPENDED: ['APPROVED'],
};

let daycareDataVersion = 0;

export function getDaycareDataVersion() {
  return daycareDataVersion;
}

export function invalidateDaycareData() {
  daycareDataVersion += 1;
}

function mapDaycare(node: DaycareApiNode): AdminDaycare {
  return {
    id: node._id,
    name: node.name,
    logoUrl: node.logoUrl ?? '',
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
    statusChangedAt: node.approval?.history?.[0]?.changedAt ?? node.submittedAt ?? '',
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
  return getSharedApprovalStatusLabel(status);
}

export function getAvailableApprovalStatusOptions(status: ApprovalStatus) {
  return allowedNextStatuses[status].map((value) => ({
    label: getSharedApprovalStatusLabel(value),
    value,
  }));
}

export function getApprovalStatusHelperText(status: ApprovalStatus) {
  switch (status) {
    case 'SUBMITTED':
      return 'Kembalikan daycare ke status pengajuan awal.';
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

export async function listDaycares({ status = 'ALL', search = '', page = 1, limit = 20 }: ListDaycaresInput = {}) {
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
        page,
        limit,
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

  invalidateDaycareData();
  return refreshed;
}

export async function updateDaycareDocuments(
  id: string,
  legalDocuments: Array<{
    type: string;
    url: string;
    verified?: boolean;
  }>
) {
  const response = await apolloClient.mutate<UpdateDaycareDocumentsResponse>({
    mutation: UPDATE_DAYCARE_DOCUMENTS_MUTATION,
    variables: {
      id,
      input: {
        legalDocuments,
      },
    },
  });

  const updated = response.data?.updateDaycareDocuments;
  if (!updated) {
    throw new Error('Failed to update daycare documents');
  }

  const refreshed = await getDaycareById(updated.id);
  if (!refreshed) {
    throw new Error(updated.message || 'Failed to reload daycare after document update');
  }

  invalidateDaycareData();
  return refreshed;
}

export async function registerDaycare(input: {
  owner: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  };
  daycare: {
    name: string;
    logoUrl?: string;
    description?: string;
    address: string;
    city: string;
  };
}) {
  const response = await apolloClient.mutate<RegisterDaycareResponse>({
    mutation: REGISTER_DAYCARE_MUTATION,
    variables: { input },
  });

  if (!response.data?.registerDaycare) {
    throw new Error('Gagal mendaftarkan daycare.');
  }

  invalidateDaycareData();
  return response.data.registerDaycare;
}
