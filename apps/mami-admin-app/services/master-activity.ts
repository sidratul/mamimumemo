import { gql } from '@apollo/client';
import { apolloClient } from './apollo';

export type MasterActivityDefinition = {
  id: string;
  name: string;
  category: string;
  defaultDuration: number;
  active: boolean;
  version: number;
  isStarter: boolean;
};

const MASTER_ACTIVITY_FIELDS = gql`
  fragment MasterActivityDefinitionFields on MasterActivity {
    id
    name
    category
    defaultDuration
    active
    version
    isStarter
  }
`;

export async function listMasterActivities() {
  const result = await apolloClient.query<{
    masterActivities: MasterActivityDefinition[];
  }>({
    query: gql`
      query MasterActivities {
        masterActivities {
          ...MasterActivityDefinitionFields
        }
      }
      ${MASTER_ACTIVITY_FIELDS}
    `,
    fetchPolicy: 'network-only',
  });
  return result.data?.masterActivities ?? [];
}

export async function createMasterActivity(input: {
  name: string;
  category: string;
  defaultDuration: number;
  isStarter: boolean;
}) {
  const result = await apolloClient.mutate<{
    createMasterActivity: MasterActivityDefinition;
  }>({
    mutation: gql`
      mutation CreateMasterActivity($input: CreateMasterActivityInput!) {
        createMasterActivity(input: $input) {
          ...MasterActivityDefinitionFields
        }
      }
      ${MASTER_ACTIVITY_FIELDS}
    `,
    variables: { input },
  });
  return result.data?.createMasterActivity;
}

export async function updateMasterActivity(
  id: string,
  input: {
    name: string;
    category: string;
    defaultDuration: number;
    isStarter: boolean;
  },
) {
  const result = await apolloClient.mutate<{
    updateMasterActivity: MasterActivityDefinition;
  }>({
    mutation: gql`
      mutation UpdateMasterActivity(
        $id: ObjectId!
        $input: UpdateMasterActivityInput!
      ) {
        updateMasterActivity(id: $id, input: $input) {
          ...MasterActivityDefinitionFields
        }
      }
      ${MASTER_ACTIVITY_FIELDS}
    `,
    variables: { id, input },
  });
  return result.data?.updateMasterActivity;
}
