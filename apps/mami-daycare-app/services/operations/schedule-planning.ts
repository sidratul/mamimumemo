import { graphqlRequest } from '../graphql/client';
import { normalizeObjectId } from './object-id';

type MasterActivitiesResponse = {
  daycareActivities: MasterActivity[];
};

type ScheduleTemplatesResponse = {
  scheduleTemplates: ScheduleTemplate[];
};

type ScheduleTemplateResponse = {
  scheduleTemplate: ScheduleTemplate | null;
};

type CreateScheduleTemplateResponse = {
  createScheduleTemplate: ScheduleTemplate;
};

type UpdateScheduleTemplateResponse = {
  updateScheduleTemplate: ScheduleTemplate;
};

type DeactivateScheduleTemplateResponse = {
  deactivateScheduleTemplate: ScheduleTemplate;
};

type ApplyScheduleTemplateResponse = {
  applyScheduleTemplate: {
    id: string;
    date: string;
  };
};

export type MasterActivity = {
  id: string;
  daycareId: string;
  name: string;
  category: string;
  defaultDuration: number;
  active: boolean;
};

export type ScheduleTemplateTargetType = 'DAY_OF_WEEK' | 'DATE_RANGE' | 'SPECIFIC_DATE';

export type ScheduleTemplateActivityInput = {
  daycareActivityId?: string;
  activityName: string;
  startTime: string;
  endTime: string;
  duration?: number;
  category: MasterActivity['category'];
  defaultSitterRole?: 'ANY' | 'SENIOR_SITTER' | 'JUNIOR_SITTER';
};

export type ScheduleTemplate = {
  id: string;
  daycareId: string;
  name: string;
  targetType?: ScheduleTemplateTargetType | string | null;
  dayOfWeek?: number[] | null;
  startDate?: string | null;
  endDate?: string | null;
  specificDate?: string | null;
  activities: ScheduleTemplateActivityInput[];
  active: boolean;
};

function normalizeScheduleTemplateActivity(activity: ScheduleTemplateActivityInput) {
  return {
    daycareActivityId: normalizeObjectId(activity.daycareActivityId) || undefined,
    activityName: String(activity.activityName ?? ''),
    startTime: String(activity.startTime ?? ''),
    endTime: String(activity.endTime ?? ''),
    duration: typeof activity.duration === 'number' ? activity.duration : Number(activity.duration ?? undefined) || undefined,
    category: String(activity.category ?? ''),
    defaultSitterRole: activity.defaultSitterRole,
  } satisfies ScheduleTemplateActivityInput;
}

function normalizeScheduleTemplate(template: ScheduleTemplate) {
  return {
    ...template,
    activities: (template.activities ?? []).map((activity) => normalizeScheduleTemplateActivity(activity)),
  };
}

const MASTER_ACTIVITIES_QUERY = `
  query DaycareActivities($daycareId: ObjectId!, $active: Boolean) {
    daycareActivities(daycareId: $daycareId, active: $active) {
      id
      daycareId
      name
      category
      defaultDuration
      active
    }
  }
`;

const SCHEDULE_TEMPLATES_QUERY = `
  query ScheduleTemplates($daycareId: ObjectId!, $active: Boolean) {
    scheduleTemplates(daycareId: $daycareId, active: $active) {
      id
      daycareId
      name
      dayOfWeek
      startDate
      endDate
      specificDate
      active
      activities {
        daycareActivityId
        activityName
        startTime
        endTime
        duration
        category
        defaultSitterRole
      }
    }
  }
`;

const SCHEDULE_TEMPLATE_QUERY = `
  query ScheduleTemplate($id: ObjectId!) {
    scheduleTemplate(id: $id) {
      id
      daycareId
      name
      dayOfWeek
      startDate
      endDate
      specificDate
      active
      activities {
        daycareActivityId
        activityName
        startTime
        endTime
        duration
        category
        defaultSitterRole
      }
    }
  }
`;

const CREATE_SCHEDULE_TEMPLATE_MUTATION = `
  mutation CreateScheduleTemplate($input: CreateScheduleTemplateInput!) {
    createScheduleTemplate(input: $input) {
      id
      daycareId
      name
      dayOfWeek
      startDate
      endDate
      specificDate
      active
      activities {
        daycareActivityId
        activityName
        startTime
        endTime
        duration
        category
        defaultSitterRole
      }
    }
  }
`;

const APPLY_SCHEDULE_TEMPLATE_MUTATION = `
  mutation ApplyScheduleTemplate($input: ApplyScheduleTemplateInput!) {
    applyScheduleTemplate(input: $input) {
      id
      date
    }
  }
`;

const UPDATE_SCHEDULE_TEMPLATE_MUTATION = `
  mutation UpdateScheduleTemplate($id: ObjectId!, $input: UpdateScheduleTemplateInput!) {
    updateScheduleTemplate(id: $id, input: $input) {
      id
      daycareId
      name
      dayOfWeek
      startDate
      endDate
      specificDate
      active
      activities {
        daycareActivityId
        activityName
        startTime
        endTime
        duration
        category
        defaultSitterRole
      }
    }
  }
`;

const DEACTIVATE_SCHEDULE_TEMPLATE_MUTATION = `
  mutation DeactivateScheduleTemplate($id: ObjectId!) {
    deactivateScheduleTemplate(id: $id) {
      id
      daycareId
      name
      dayOfWeek
      startDate
      endDate
      specificDate
      active
      activities {
        daycareActivityId
        activityName
        startTime
        endTime
        duration
        category
        defaultSitterRole
      }
    }
  }
`;

export async function listMasterActivities(token: string, daycareId: string, active = true) {
  const data = await graphqlRequest<MasterActivitiesResponse, { daycareId: string; active: boolean }>(
    MASTER_ACTIVITIES_QUERY,
    { daycareId: normalizeObjectId(daycareId), active },
    token
  );

  return data.daycareActivities;
}

export async function listScheduleTemplates(token: string, daycareId: string, active = true) {
  const data = await graphqlRequest<ScheduleTemplatesResponse, { daycareId: string; active: boolean }>(
    SCHEDULE_TEMPLATES_QUERY,
    { daycareId: normalizeObjectId(daycareId), active },
    token
  );

  return data.scheduleTemplates.map((template) => normalizeScheduleTemplate(template));
}

export async function getScheduleTemplate(token: string, id: string) {
  const data = await graphqlRequest<ScheduleTemplateResponse, { id: string }>(
    SCHEDULE_TEMPLATE_QUERY,
    { id: normalizeObjectId(id) },
    token,
  );

  return data.scheduleTemplate ? normalizeScheduleTemplate(data.scheduleTemplate) : null;
}

export async function createScheduleTemplate(
  token: string,
  input: {
    daycareId: string;
    name: string;
    targetType: ScheduleTemplateTargetType;
    dayOfWeek?: number[];
    startDate?: string;
    endDate?: string;
    specificDate?: string;
    activities?: ScheduleTemplateActivityInput[];
  }
) {
  const data = await graphqlRequest<CreateScheduleTemplateResponse, { input: Record<string, unknown> }>(
    CREATE_SCHEDULE_TEMPLATE_MUTATION,
    { input: { ...input, daycareId: normalizeObjectId(input.daycareId), activities: input.activities ?? [] } },
    token
  );

  return normalizeScheduleTemplate(data.createScheduleTemplate);
}

export async function updateScheduleTemplate(
  token: string,
  id: string,
  input: {
    name?: string;
    targetType?: ScheduleTemplateTargetType;
    dayOfWeek?: number[];
    startDate?: string;
    endDate?: string;
    specificDate?: string;
    activities?: ScheduleTemplateActivityInput[];
    active?: boolean;
  }
) {
  const data = await graphqlRequest<UpdateScheduleTemplateResponse, { id: string; input: Record<string, unknown> }>(
    UPDATE_SCHEDULE_TEMPLATE_MUTATION,
    { id, input },
    token
  );

  return normalizeScheduleTemplate(data.updateScheduleTemplate);
}

export async function deactivateScheduleTemplate(token: string, id: string) {
  const data = await graphqlRequest<DeactivateScheduleTemplateResponse, { id: string }>(
    DEACTIVATE_SCHEDULE_TEMPLATE_MUTATION,
    { id },
    token
  );

  return normalizeScheduleTemplate(data.deactivateScheduleTemplate);
}

export async function applyScheduleTemplateForDate(
  token: string,
  input: {
    daycareId: string;
    date: string;
    templateId: string;
  }
) {
  const data = await graphqlRequest<ApplyScheduleTemplateResponse, { input: Record<string, unknown> }>(
    APPLY_SCHEDULE_TEMPLATE_MUTATION,
    { input },
    token
  );

  return data.applyScheduleTemplate;
}
