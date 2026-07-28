import { graphqlRequest } from '../graphql/client';
import { normalizeObjectId } from './object-id';

export type MasterActivityCategory = string;

export type MasterActivity = {
  id: string;
  daycareId: string;
  sourceMasterActivityId?: string | null;
  sourceMasterVersion?: number | null;
  name: string;
  description?: string | null;
  category: MasterActivityCategory;
  defaultDuration: number;
  icon?: string | null;
  color?: string | null;
  active: boolean;
};

export type GlobalMasterActivity = Omit<
  MasterActivity,
  'daycareId' | 'sourceMasterActivityId' | 'sourceMasterVersion'
> & {
  version: number;
  isStarter: boolean;
};

type MasterActivitiesResponse = {
  daycareActivities: MasterActivity[];
};

type CreateMasterActivityResponse = {
  createDaycareActivity: MasterActivity;
};

type UpdateMasterActivityResponse = {
  updateDaycareActivity: MasterActivity;
};

type DeactivateMasterActivityResponse = {
  deactivateDaycareActivity: MasterActivity;
};

type GlobalMasterActivitiesResponse = {
  masterActivities: GlobalMasterActivity[];
};

type AdoptMasterActivityResponse = {
  adoptMasterActivity: MasterActivity;
};

const MASTER_ACTIVITIES_QUERY = `
  query DaycareActivities($daycareId: ObjectId!, $active: Boolean) {
    daycareActivities(daycareId: $daycareId, active: $active) {
      id
      daycareId
      sourceMasterActivityId
      sourceMasterVersion
      name
      description
      category
      defaultDuration
      icon
      color
      active
    }
  }
`;

const CREATE_MASTER_ACTIVITY_MUTATION = `
  mutation CreateDaycareActivity($input: CreateDaycareActivityInput!) {
    createDaycareActivity(input: $input) {
      id
      daycareId
      sourceMasterActivityId
      sourceMasterVersion
      name
      description
      category
      defaultDuration
      icon
      color
      active
    }
  }
`;

const UPDATE_MASTER_ACTIVITY_MUTATION = `
  mutation UpdateDaycareActivity($id: ObjectId!, $input: UpdateDaycareActivityInput!) {
    updateDaycareActivity(id: $id, input: $input) {
      id
      daycareId
      sourceMasterActivityId
      sourceMasterVersion
      name
      description
      category
      defaultDuration
      icon
      color
      active
    }
  }
`;

const DEACTIVATE_MASTER_ACTIVITY_MUTATION = `
  mutation DeactivateDaycareActivity($id: ObjectId!) {
    deactivateDaycareActivity(id: $id) {
      id
      daycareId
      sourceMasterActivityId
      sourceMasterVersion
      name
      description
      category
      defaultDuration
      icon
      color
      active
    }
  }
`;

const GLOBAL_MASTER_ACTIVITIES_QUERY = `
  query GlobalMasterActivities($active: Boolean) {
    masterActivities(active: $active) {
      id
      name
      description
      category
      defaultDuration
      icon
      color
      active
      version
      isStarter
    }
  }
`;

const ADOPT_MASTER_ACTIVITY_MUTATION = `
  mutation AdoptMasterActivity($input: AdoptMasterActivityInput!) {
    adoptMasterActivity(input: $input) {
      id
      daycareId
      sourceMasterActivityId
      sourceMasterVersion
      name
      description
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
    { daycareId: normalizeObjectId(daycareId), active },
    token
  );

  return data.daycareActivities;
}

export async function createMasterActivity(
  token: string,
  input: {
    daycareId: string;
    name: string;
    description?: string;
    category: MasterActivityCategory;
    defaultDuration?: number;
    icon?: string;
    color?: string;
  }
) {
  const data = await graphqlRequest<CreateMasterActivityResponse, { input: Record<string, unknown> }>(
    CREATE_MASTER_ACTIVITY_MUTATION,
    { input: { ...input, daycareId: normalizeObjectId(input.daycareId) } },
    token
  );

  return data.createDaycareActivity;
}

export async function updateMasterActivity(
  token: string,
  id: string,
  input: {
    name?: string;
    description?: string;
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

  return data.updateDaycareActivity;
}

export async function deactivateMasterActivity(token: string, id: string) {
  const data = await graphqlRequest<DeactivateMasterActivityResponse, { id: string }>(
    DEACTIVATE_MASTER_ACTIVITY_MUTATION,
    { id },
    token
  );

  return data.deactivateDaycareActivity;
}

export async function listGlobalMasterActivities(token: string) {
  const data = await graphqlRequest<
    GlobalMasterActivitiesResponse,
    { active: boolean }
  >(GLOBAL_MASTER_ACTIVITIES_QUERY, { active: true }, token);
  return data.masterActivities;
}

export async function adoptMasterActivity(
  token: string,
  daycareId: string,
  masterActivityId: string,
) {
  const data = await graphqlRequest<
    AdoptMasterActivityResponse,
    { input: { daycareId: string; masterActivityId: string } }
  >(
    ADOPT_MASTER_ACTIVITY_MUTATION,
    { input: { daycareId: normalizeObjectId(daycareId), masterActivityId } },
    token,
  );
  return data.adoptMasterActivity;
}
