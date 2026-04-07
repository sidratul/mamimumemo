import { graphqlRequest } from '../graphql/client';

type ViewerProfileResponse = {
  profile: {
    _id: string;
    name: string;
  };
};

type TodayDailyCareResponse = {
  todayDailyCare: DailyCareRecord | null;
};

type ChildDailyRecordsResponse = {
  childDailyRecords: DailyCareRecord[];
};

type CheckInResponse = {
  checkInChild: DailyCareRecord;
};

type CheckOutResponse = {
  checkOutChild: DailyCareRecord;
};

type LogActivityResponse = {
  logDailyActivity: DailyCareRecord;
};

export type DailyCareRecord = {
  id: string;
  date: string;
  totalChildren: number;
  children: DailyCareChildRecord[];
};

export type DailyCareChildRecord = {
  childId: string;
  childName: string;
  childPhoto?: string | null;
  notes?: string | null;
  attendance?: {
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_PICKUP';
    checkIn: {
      time: string;
      photo: string;
      by: {
        userId: string;
        name: string;
      };
    };
    checkOut?: {
      time: string;
      photo: string;
      by: {
        userId: string;
        name: string;
      };
    } | null;
  } | null;
  activities: Array<{
    activityName: string;
    category: string;
    startTime: string;
    description?: string | null;
    loggedAt: string;
  }>;
};

export type ViewerProfile = {
  _id: string;
  name: string;
};

export type QuickActivityInput = {
  daycareId: string;
  childId: string;
  category: 'MEAL' | 'NAP' | 'CARE' | 'PLAY' | 'LEARNING';
  activityName: string;
  description?: string;
  startTime: string;
};

const PROFILE_QUERY = `
  query ViewerProfile {
    profile {
      _id
      name
    }
  }
`;

const TODAY_DAILY_CARE_QUERY = `
  query TodayDailyCare($daycareId: ObjectId!) {
    todayDailyCare(daycareId: $daycareId) {
      id
      date
      totalChildren
      children {
        childId
        childName
        childPhoto
        notes
        attendance {
          status
          checkIn {
            time
            photo
            by {
              userId
              name
            }
          }
          checkOut {
            time
            photo
            by {
              userId
              name
            }
          }
        }
        activities {
          activityName
          category
          startTime
          description
          loggedAt
        }
      }
    }
  }
`;

const CHILD_DAILY_RECORDS_QUERY = `
  query ChildDailyRecords($childId: ObjectId!, $startDate: Date!, $endDate: Date!) {
    childDailyRecords(childId: $childId, startDate: $startDate, endDate: $endDate) {
      id
      date
      totalChildren
      children {
        childId
        childName
        childPhoto
        notes
        attendance {
          status
          checkIn {
            time
            photo
            by {
              userId
              name
            }
          }
          checkOut {
            time
            photo
            by {
              userId
              name
            }
          }
        }
        activities {
          activityName
          category
          startTime
          description
          loggedAt
        }
      }
    }
  }
`;

const CHECK_IN_CHILD_MUTATION = `
  mutation CheckInChild($input: CheckInChildInput!) {
    checkInChild(input: $input) {
      id
      date
      totalChildren
      children {
        childId
        childName
        childPhoto
        notes
        attendance {
          status
          checkIn {
            time
            photo
            by {
              userId
              name
            }
          }
          checkOut {
            time
            photo
            by {
              userId
              name
            }
          }
        }
        activities {
          activityName
          category
          startTime
          description
          loggedAt
        }
      }
    }
  }
`;

const CHECK_OUT_CHILD_MUTATION = `
  mutation CheckOutChild($input: CheckOutChildInput!) {
    checkOutChild(input: $input) {
      id
      date
      totalChildren
      children {
        childId
        childName
        childPhoto
        notes
        attendance {
          status
          checkIn {
            time
            photo
            by {
              userId
              name
            }
          }
          checkOut {
            time
            photo
            by {
              userId
              name
            }
          }
        }
        activities {
          activityName
          category
          startTime
          description
          loggedAt
        }
      }
    }
  }
`;

const LOG_DAILY_ACTIVITY_MUTATION = `
  mutation LogDailyActivity($input: LogDailyActivityInput!) {
    logDailyActivity(input: $input) {
      id
      date
      totalChildren
      children {
        childId
        childName
        childPhoto
        notes
        attendance {
          status
          checkIn {
            time
            photo
            by {
              userId
              name
            }
          }
          checkOut {
            time
            photo
            by {
              userId
              name
            }
          }
        }
        activities {
          activityName
          category
          startTime
          description
          loggedAt
        }
      }
    }
  }
`;

function todayIsoDate() {
  return new Date().toISOString();
}

function currentTimeLabel() {
  return new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export async function getViewerProfile(token: string) {
  const data = await graphqlRequest<ViewerProfileResponse>(PROFILE_QUERY, undefined, token);
  return data.profile;
}

export async function getTodayDailyCare(token: string, daycareId: string) {
  const data = await graphqlRequest<TodayDailyCareResponse, { daycareId: string }>(
    TODAY_DAILY_CARE_QUERY,
    { daycareId },
    token
  );
  return data.todayDailyCare;
}

export async function getChildDailyRecords(token: string, childId: string, startDate: string, endDate: string) {
  const data = await graphqlRequest<ChildDailyRecordsResponse, { childId: string; startDate: string; endDate: string }>(
    CHILD_DAILY_RECORDS_QUERY,
    { childId, startDate, endDate },
    token
  );

  return data.childDailyRecords;
}

export async function checkInChildForToday(token: string, daycareId: string, childId: string, viewer: ViewerProfile) {
  const data = await graphqlRequest<CheckInResponse, { input: Record<string, unknown> }>(
    CHECK_IN_CHILD_MUTATION,
    {
      input: {
        daycareId,
        childId,
        date: todayIsoDate(),
        checkIn: {
          time: currentTimeLabel(),
          photo: 'https://placehold.co/1200x800/png?text=Check-In',
          by: {
            userId: viewer._id,
            name: viewer.name,
          },
        },
      },
    },
    token
  );

  return data.checkInChild;
}

export async function checkOutChildForToday(token: string, daycareId: string, childId: string, viewer: ViewerProfile) {
  const data = await graphqlRequest<CheckOutResponse, { input: Record<string, unknown> }>(
    CHECK_OUT_CHILD_MUTATION,
    {
      input: {
        daycareId,
        childId,
        date: todayIsoDate(),
        checkOut: {
          time: currentTimeLabel(),
          photo: 'https://placehold.co/1200x800/png?text=Check-Out',
          by: {
            userId: viewer._id,
            name: viewer.name,
          },
        },
      },
    },
    token
  );

  return data.checkOutChild;
}

export async function logQuickDailyActivity(token: string, input: QuickActivityInput) {
  const data = await graphqlRequest<LogActivityResponse, { input: Record<string, unknown> }>(
    LOG_DAILY_ACTIVITY_MUTATION,
    {
      input: {
        daycareId: input.daycareId,
        childId: input.childId,
        date: todayIsoDate(),
        activity: {
          activityName: input.activityName.trim(),
          category: input.category,
          startTime: input.startTime,
          description: input.description?.trim() || null,
        },
      },
    },
    token
  );

  return data.logDailyActivity;
}
