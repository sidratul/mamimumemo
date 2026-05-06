import { gql } from '@apollo/client';
import { apolloClient } from './apollo';
import { mapDaycare } from '../shared/daycare/logic';
import { DAYCARE_FIELDS } from '../shared/daycare/fragments';
import { DaycareRecord, ApprovalStatus } from '../shared/daycare/types';

let v = 0;
export const getDaycareDataVersion = () => v;
export const invalidateDaycareData = () => { v += 1; };

export async function listDaycares(input: { status?: ApprovalStatus | 'ALL', search?: string, page?: number, limit?: number } = {}) {
  try {
    const res = await apolloClient.query<{ daycares: DaycareRecord[], daycareCount: number }>({
      query: gql`
        query ListDaycares($filter: DaycareFilterInput, $sort: SortInput, $pagination: PaginationInput) {
          daycares(filter: $filter, sort: $sort, pagination: $pagination) { ...DaycareFields }
          daycareCount(filter: $filter)
        }
        ${DAYCARE_FIELDS}
      `,
      variables: {
        filter: { 
          statuses: input.status === 'ALL' ? undefined : (input.status ? [input.status] : undefined), 
          search: input.search?.trim() || undefined 
        },
        sort: { sortBy: 'createdAt', sortType: 'DESC' },
        pagination: { page: input.page || 1, limit: input.limit || 20 },
      }
    });
    return { 
      items: res.data?.daycares || [], 
      total: res.data?.daycareCount || 0,
      loading: res.loading,
      error: res.error,
    };
  } catch (error) {
    return { items: [], total: 0, loading: false, error: error as Error };
  }
}

export async function getDaycareById(id: string) {
  try {
    const res = await apolloClient.query<{ daycare: DaycareRecord | null }>({
      query: gql`query GetDaycare($id: ObjectId!) { daycare(id: $id) { ...DaycareFields } } ${DAYCARE_FIELDS}`,
      variables: { id }
    });
    return { data: res.data?.daycare || null, loading: res.loading, error: res.error };
  } catch (error) {
    return { data: null, loading: false, error: error as Error };
  }
}

export async function updateDaycareApprovalStatus(id: string, status: ApprovalStatus, note: string) {
  const res = await apolloClient.mutate<{ updateDaycareApprovalStatus: { id: string } }>({
    mutation: gql`mutation UpdateDaycareApprovalStatus($id: ObjectId!, $input: UpdateDaycareApprovalInput!) {
      updateDaycareApprovalStatus(id: $id, input: $input) { id message }
    }`,
    variables: { id, input: { status, note } }
  });
  invalidateDaycareData();
  return await getDaycareById(id);
}

export async function updateDaycareDocuments(id: string, legalDocuments: { type: string, url: string, verified?: boolean }[]) {
  const res = await apolloClient.mutate<{ updateDaycareDocuments: { id: string } }>({
    mutation: gql`mutation UpdateDaycareDocuments($id: ObjectId!, $input: UpdateDaycareDocumentsInput!) {
      updateDaycareDocuments(id: $id, input: $input) { id message }
    }`,
    variables: { id, input: { legalDocuments } }
  });
  invalidateDaycareData();
  return await getDaycareById(id);
}

export async function registerDaycare(input: any) {
  const res = await apolloClient.mutate({
    mutation: gql`mutation RegisterDaycare($input: RegisterDaycareInput!) {
      registerDaycare(input: $input) { id message }
    }`,
    variables: { input }
  });
  invalidateDaycareData();
  return res;
}
