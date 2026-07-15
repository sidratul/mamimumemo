import { graphqlRequest } from '../graphql/client';

type MasterActivitiesResponse = {
  daycareActivities: MasterActivity[];
};

type ScheduleTemplatesResponse = {
  scheduleTemplates: ScheduleTemplate[];
};

type CreateScheduleTemplateResponse = {
  createScheduleTemplate: ScheduleTemplate;
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
  targetType: ScheduleTemplateTargetType;
  dayOfWeek?: number[] | null;
  startDate?: string | null;
  endDate?: string | null;
  specificDate?: string | null;
  activities: ScheduleTemplateActivityInput[];
  active: boolean;
};

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
      targetType
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
      targetType
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

export async function listMasterActivities(token: string, daycareId: string, active = true) {
  const data = await graphqlRequest<MasterActivitiesResponse, { daycareId: string; active: boolean }>(
    MASTER_ACTIVITIES_QUERY,
    { daycareId, active },
    token
  );

  return data.daycareActivities;
}

export async function listScheduleTemplates(token: string, daycareId: string, active = true) {
  const data = await graphqlRequest<ScheduleTemplatesResponse, { daycareId: string; active: boolean }>(
    SCHEDULE_TEMPLATES_QUERY,
    { daycareId, active },
    token
  );

  return data.scheduleTemplates;
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
    activities: ScheduleTemplateActivityInput[];
  }
) {
  const data = await graphqlRequest<CreateScheduleTemplateResponse, { input: Record<string, unknown> }>(
    CREATE_SCHEDULE_TEMPLATE_MUTATION,
    { input },
    token
  );

  return data.createScheduleTemplate;
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
