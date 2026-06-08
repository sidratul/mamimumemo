import { graphqlRequest } from '../graphql/client';

export type MasterActivityCategory = 'MEAL' | 'NAP' | 'CARE' | 'PLAY' | 'LEARNING';

export type MasterActivity = {
  id: string;
  daycareId: string;
  name: string;
  category: MasterActivityCategory;
  defaultDuration: number;
  icon?: string | null;
  color?: string | null;
  active: boolean;
};

type MasterActivitiesResponse = {
  masterActivities: MasterActivity[];
};

type CreateMasterActivityResponse = {
  createMasterActivity: MasterActivity;
};

type UpdateMasterActivityResponse = {
  updateMasterActivity: MasterActivity;
};

type DeactivateMasterActivityResponse = {
  deactivateMasterActivity: MasterActivity;
};

const MASTER_ACTIVITIES_QUERY = `
  query MasterActivities($daycareId: ObjectId!, $active: Boolean) {
    masterActivities(daycareId: $daycareId, active: $active) {
      id
      daycareId
      name
      category
      defaultDuration
      icon
      color
      active
    }
  }
`;

const CREATE_MASTER_ACTIVITY_MUTATION = `
  mutation CreateMasterActivity($input: CreateMasterActivityInput!) {
    createMasterActivity(input: $input) {
      id
      daycareId
      name
      category
      defaultDuration
      icon
      color
      active
    }
  }
`;

const UPDATE_MASTER_ACTIVITY_MUTATION = `
  mutation UpdateMasterActivity($id: ObjectId!, $input: UpdateMasterActivityInput!) {
    updateMasterActivity(id: $id, input: $input) {
      id
      daycareId
      name
      category
      defaultDuration
      icon
      color
      active
    }
  }
`;

const DEACTIVATE_MASTER_ACTIVITY_MUTATION = `
  mutation DeactivateMasterActivity($id: ObjectId!) {
    deactivateMasterActivity(id: $id) {
      id
      daycareId
      name
      category
      defaultDuration
      icon
      color
      active
    }
  }
`;

export async function listMasterActivities(token: string, daycareId: string, active?: boolean) {
  const data = await graphqlRequest<MasterActivitiesResponse, { daycareId: string; active?: boolean }>(
    MASTER_ACTIVITIES_QUERY,
    { daycareId, active },
    token
  );

  return data.masterActivities;
}

export async function createMasterActivity(
  token: string,
  input: {
    daycareId: string;
    name: string;
    category: MasterActivityCategory;
    defaultDuration?: number;
    icon?: string;
    color?: string;
  }
) {
  const data = await graphqlRequest<CreateMasterActivityResponse, { input: Record<string, unknown> }>(
    CREATE_MASTER_ACTIVITY_MUTATION,
    { input },
    token
  );

  return data.createMasterActivity;
}

export async function updateMasterActivity(
  token: string,
  id: string,
  input: {
    name?: string;
    category?: MasterActivityCategory;
    defaultDuration?: number;
    icon?: string;
    color?: string;
    active?: boolean;
  }
) {
  const data = await graphqlRequest<UpdateMasterActivityResponse, { id: string; input: Record<string, unknown> }>(
    UPDATE_MASTER_ACTIVITY_MUTATION,
    { id, input },
    token
  );

  return data.updateMasterActivity;
}

export async function deactivateMasterActivity(token: string, id: string) {
  const data = await graphqlRequest<DeactivateMasterActivityResponse, { id: string }>(
    DEACTIVATE_MASTER_ACTIVITY_MUTATION,
    { id },
    token
  );

  return data.deactivateMasterActivity;
}
