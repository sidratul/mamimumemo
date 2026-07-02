import { gql } from '@apollo/client';
import { apolloClient } from './apollo';

export type ActivityCategoryDefinition = {
  _id: string;
  code: string;
  defaultLabel: string;
  behaviorType: 'MEAL' | 'NAP' | 'TOILETING' | 'CARE' | 'PLAY' | 'LEARNING' | 'GENERIC';
  defaultColor?: string | null;
  defaultIcon?: string | null;
  sortOrder: number;
  isActive: boolean;
};

const CATEGORY_FIELDS = gql`
  fragment ActivityCategoryFields on ActivityCategoryDefinition {
    _id
    code
    defaultLabel
    behaviorType
    defaultColor
    defaultIcon
    sortOrder
    isActive
  }
`;

export async function listActivityCategories() {
  const result = await apolloClient.query<{ activityCategories: ActivityCategoryDefinition[] }>({
    query: gql`
      query ActivityCategories {
        activityCategories {
          ...ActivityCategoryFields
        }
      }
      ${CATEGORY_FIELDS}
    `,
    fetchPolicy: 'network-only',
  });
  return result.data?.activityCategories ?? [];
}

export async function createActivityCategory(input: {
  code: string;
  defaultLabel: string;
  behaviorType: ActivityCategoryDefinition['behaviorType'];
  defaultColor?: string;
  defaultIcon?: string;
  sortOrder?: number;
}) {
  return await apolloClient.mutate<{ createActivityCategory: ActivityCategoryDefinition }>({
    mutation: gql`
      mutation CreateActivityCategory($input: CreateActivityCategoryDefinitionInput!) {
        createActivityCategory(input: $input) {
          ...ActivityCategoryFields
        }
      }
      ${CATEGORY_FIELDS}
    `,
    variables: { input },
  });
}

export async function updateActivityCategory(
  id: string,
  input: Partial<Omit<ActivityCategoryDefinition, '_id' | 'code'>>,
) {
  return await apolloClient.mutate<{ updateActivityCategory: ActivityCategoryDefinition }>({
    mutation: gql`
      mutation UpdateActivityCategory(
        $id: ObjectId!
        $input: UpdateActivityCategoryDefinitionInput!
      ) {
        updateActivityCategory(id: $id, input: $input) {
          ...ActivityCategoryFields
        }
      }
      ${CATEGORY_FIELDS}
    `,
    variables: { id, input },
  });
}
