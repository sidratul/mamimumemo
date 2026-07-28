import { graphqlRequest } from '../graphql/client';
import { normalizeObjectId } from './object-id';

export type ResolvedActivityCategory = {
  _id: string;
  code: string;
  label: string;
  defaultLabel: string;
  color?: string | null;
  icon?: string | null;
  enabled: boolean;
  resolvedSortOrder: number;
};

const CATEGORIES_QUERY = `
  query ActivityCategories($daycareId: ObjectId!) {
    activityCategories(daycareId: $daycareId, active: true) {
      _id
      code
      label
      defaultLabel
      color
      icon
      enabled
      resolvedSortOrder
    }
  }
`;

const UPDATE_CATEGORY_MUTATION = `
  mutation UpdateDaycareActivityCategory(
    $daycareId: ObjectId!
    $categoryId: ObjectId!
    $input: UpdateDaycareActivityCategoryInput!
  ) {
    updateDaycareActivityCategory(
      daycareId: $daycareId
      categoryId: $categoryId
      input: $input
    ) {
      daycareId
      updatedAt
    }
  }
`;

export async function getResolvedActivityCategories(token: string, daycareId: string) {
  const result = await graphqlRequest<
    { activityCategories: ResolvedActivityCategory[] },
    { daycareId: string }
  >(CATEGORIES_QUERY, { daycareId: normalizeObjectId(daycareId) }, token);
  return result.activityCategories;
}

export async function updateDaycareActivityCategory(
  token: string,
  daycareId: string,
  categoryId: string,
  input: {
    label?: string;
    color?: string;
    enabled?: boolean;
    sortOrder?: number;
  },
) {
  return await graphqlRequest<
    { updateDaycareActivityCategory: { daycareId: string; updatedAt?: string } },
    {
      daycareId: string;
      categoryId: string;
      input: Record<string, unknown>;
    }
  >(UPDATE_CATEGORY_MUTATION, { daycareId: normalizeObjectId(daycareId), categoryId, input }, token);
}
