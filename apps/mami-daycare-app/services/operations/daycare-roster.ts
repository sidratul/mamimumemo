import { graphqlRequest } from '../graphql/client';
import { normalizeObjectId } from './object-id';

export type DaycareParent = {
  id: string;
  user: {
    userId: string;
    name: string;
    email: string;
    phone: string;
    role: 'PARENT';
  };
  customData: {
    notes?: string | null;
    deskripsi?: string | null;
  };
  childrenIds: string[];
  active: boolean;
};

export type DaycareChild = {
  id: string;
  parentId: string;
  profile: {
    name: string;
    birthDate: string;
    gender: 'MALE' | 'FEMALE';
  };
  medical: {
    allergies: string[];
    medicalNotes?: string | null;
    medications: Array<{
      name: string;
      dosage: string;
      schedule: string;
    }>;
  };
  preferences: {
    favoriteFoods: string[];
    dislikedFoods: string[];
    favoriteActivities: string[];
    comfortItems: string[];
    napRoutine?: string | null;
  };
  customData: {
    notes?: string | null;
    cognitiveNotes?: string | null;
    developmentNotes?: string | null;
    strengths: string[];
    weaknesses: string[];
  };
  active: boolean;
};

type RosterQueryResponse = {
  daycareParents: DaycareParent[];
  daycareChildren: DaycareChild[];
};

type CreateParentAccountResponse = {
  createParentAccount: DaycareParent;
};

type CreateChildResponse = {
  createChildrenDaycare: DaycareChild;
};

type UpdateParentResponse = {
  updateParent: DaycareParent;
};

type UpdateParentAccountResponse = {
  updateParentAccount: DaycareParent;
};

type DeactivateParentResponse = {
  deactivateParent: DaycareParent;
};

type UpdateChildResponse = {
  updateChildrenDaycare: DaycareChild;
};

type DeactivateChildResponse = {
  deactivateChildrenDaycare: DaycareChild;
};

type ActionResponse = {
  id?: string | null;
  message?: string | null;
};

type PurgeChildResponse = {
  purgeChildrenDaycare: ActionResponse;
};

export type FamilyEnrollmentInput = {
  daycareId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentPassword: string;
  parentNotes?: string;
  childName: string;
  childBirthDate: string;
  childGender: 'MALE' | 'FEMALE';
  childNotes?: string;
};

export type CreateDaycareParentInput = {
  daycareId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  notes?: string;
};

export type CreateDaycareChildInput = {
  daycareId: string;
  parentId: string;
  name: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  notes?: string;
};

export type UpdateDaycareChildDetailsInput = {
  profile?: {
    name: string;
    birthDate: string;
    gender: 'MALE' | 'FEMALE';
  };
  medical?: {
    allergies?: string[];
    medicalNotes?: string | null;
    medications?: Array<{
      name: string;
      dosage: string;
      schedule: string;
    }>;
  };
  preferences?: {
    favoriteFoods?: string[];
    dislikedFoods?: string[];
    favoriteActivities?: string[];
    comfortItems?: string[];
    napRoutine?: string | null;
  };
  customData?: {
    notes?: string | null;
    cognitiveNotes?: string | null;
    developmentNotes?: string | null;
    strengths?: string[];
    weaknesses?: string[];
  };
};

const DAYCARE_ROSTER_QUERY = `
  query DaycareRoster($daycareId: ObjectId!) {
    daycareParents(daycareId: $daycareId, active: true) {
      id
      active
      user {
        userId
        name
        email
        phone
        role
      }
      customData {
        deskripsi
        notes
      }
      childrenIds
    }
    daycareChildren(daycareId: $daycareId, active: true) {
      id
      parentId
      active
      profile {
        name
        birthDate
        gender
      }
      medical {
        allergies
        medicalNotes
        medications {
          name
          dosage
          schedule
        }
      }
      preferences {
        favoriteFoods
        dislikedFoods
        favoriteActivities
        comfortItems
        napRoutine
      }
      customData {
        notes
        cognitiveNotes
        developmentNotes
        strengths
        weaknesses
      }
    }
  }
`;

const CREATE_PARENT_ACCOUNT_MUTATION = `
  mutation CreateParentAccount($input: CreateParentAccountInput!) {
    createParentAccount(input: $input) {
      id
      active
      user {
        userId
        name
        email
        phone
        role
      }
      customData {
        deskripsi
        notes
      }
      childrenIds
    }
  }
`;

const CREATE_CHILD_MUTATION = `
  mutation CreateChildrenDaycare($input: CreateChildrenDaycareInput!) {
    createChildrenDaycare(input: $input) {
      id
      parentId
      active
      profile {
        name
        birthDate
        gender
      }
      medical {
        allergies
        medicalNotes
        medications {
          name
          dosage
          schedule
        }
      }
      preferences {
        favoriteFoods
        dislikedFoods
        favoriteActivities
        comfortItems
        napRoutine
      }
      customData {
        notes
        cognitiveNotes
        developmentNotes
        strengths
        weaknesses
      }
    }
  }
`;

const UPDATE_PARENT_MUTATION = `
  mutation UpdateParent($id: ObjectId!, $input: UpdateParentInput!) {
    updateParent(id: $id, input: $input) {
      id
      active
      user {
        userId
        name
        email
        phone
        role
      }
      customData {
        deskripsi
        notes
      }
      childrenIds
    }
  }
`;

const UPDATE_PARENT_ACCOUNT_MUTATION = `
  mutation UpdateParentAccount($id: ObjectId!, $input: UpdateParentAccountInput!) {
    updateParentAccount(id: $id, input: $input) {
      id
      active
      user {
        userId
        name
        email
        phone
        role
      }
      customData {
        deskripsi
        notes
      }
      childrenIds
    }
  }
`;

const DEACTIVATE_PARENT_MUTATION = `
  mutation DeactivateParent($id: ObjectId!) {
    deactivateParent(id: $id) {
      id
      active
    }
  }
`;

const UPDATE_CHILD_MUTATION = `
  mutation UpdateChildrenDaycare($id: ObjectId!, $input: UpdateChildrenDaycareInput!) {
    updateChildrenDaycare(id: $id, input: $input) {
      id
      parentId
      active
      profile {
        name
        birthDate
        gender
      }
      medical {
        allergies
        medicalNotes
        medications {
          name
          dosage
          schedule
        }
      }
      preferences {
        favoriteFoods
        dislikedFoods
        favoriteActivities
        comfortItems
        napRoutine
      }
      customData {
        notes
        cognitiveNotes
        developmentNotes
        strengths
        weaknesses
      }
    }
  }
`;

const DEACTIVATE_CHILD_MUTATION = `
  mutation DeactivateChildrenDaycare($id: ObjectId!) {
    deactivateChildrenDaycare(id: $id) {
      id
      active
    }
  }
`;

const PURGE_CHILD_MUTATION = `
  mutation PurgeChildrenDaycare($id: ObjectId!) {
    purgeChildrenDaycare(id: $id) {
      id
      message
    }
  }
`;

export async function getDaycareRoster(token: string, daycareId: string) {
  const data = await graphqlRequest<RosterQueryResponse, { daycareId: string }>(
    DAYCARE_ROSTER_QUERY,
    { daycareId: normalizeObjectId(daycareId) },
    token
  );

  return {
    parents: data.daycareParents,
    children: data.daycareChildren,
  };
}

export async function onboardFamily(token: string, input: FamilyEnrollmentInput) {
  const parentResult = await graphqlRequest<CreateParentAccountResponse, { input: Record<string, unknown> }>(
    CREATE_PARENT_ACCOUNT_MUTATION,
    {
      input: {
        daycareId: normalizeObjectId(input.daycareId),
        name: input.parentName.trim(),
        email: input.parentEmail.trim().toLowerCase(),
        phone: input.parentPhone.trim(),
        password: input.parentPassword,
        notes: input.parentNotes?.trim() || undefined,
      },
    },
    token
  );

  const childResult = await graphqlRequest<CreateChildResponse, { input: Record<string, unknown> }>(
    CREATE_CHILD_MUTATION,
    {
      input: {
        daycareId: normalizeObjectId(input.daycareId),
        parentId: parentResult.createParentAccount.id,
        profile: {
          name: input.childName.trim(),
          birthDate: input.childBirthDate,
          gender: input.childGender,
        },
        customData: {
          notes: input.childNotes?.trim() || null,
        },
      },
    },
    token
  );

  return {
    parent: parentResult.createParentAccount,
    child: childResult.createChildrenDaycare,
  };
}

export async function createDaycareParent(token: string, input: CreateDaycareParentInput) {
  const data = await graphqlRequest<CreateParentAccountResponse, { input: Record<string, unknown> }>(
    CREATE_PARENT_ACCOUNT_MUTATION,
    {
      input: {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
        phone: input.phone.trim(),
        daycareId: normalizeObjectId(input.daycareId),
        notes: input.notes?.trim() || undefined,
      },
    },
    token,
  );

  return data.createParentAccount;
}

export async function updateDaycareParentNotes(token: string, parentId: string, notes: string) {
  const data = await graphqlRequest<UpdateParentResponse, { id: string; input: Record<string, unknown> }>(
    UPDATE_PARENT_MUTATION,
    {
      id: parentId,
      input: {
        customData: {
          notes: notes.trim() || null,
        },
      },
    },
    token
  );

  return data.updateParent;
}

export async function updateDaycareParentProfile(
  token: string,
  parentId: string,
  input: {
    name: string;
    notes?: string;
  },
) {
  const data = await graphqlRequest<UpdateParentAccountResponse, { id: string; input: Record<string, unknown> }>(
    UPDATE_PARENT_ACCOUNT_MUTATION,
    {
      id: parentId,
      input: {
        name: input.name.trim(),
        notes: input.notes?.trim() || '',
      },
    },
    token,
  );

  return data.updateParentAccount;
}

export async function deactivateDaycareParent(token: string, parentId: string) {
  const data = await graphqlRequest<DeactivateParentResponse, { id: string }>(
    DEACTIVATE_PARENT_MUTATION,
    { id: parentId },
    token
  );

  return data.deactivateParent;
}

export async function createDaycareChild(token: string, input: CreateDaycareChildInput) {
  const data = await graphqlRequest<CreateChildResponse, { input: Record<string, unknown> }>(
    CREATE_CHILD_MUTATION,
    {
      input: {
        daycareId: normalizeObjectId(input.daycareId),
        parentId: input.parentId,
        profile: {
          name: input.name.trim(),
          birthDate: input.birthDate,
          gender: input.gender,
        },
        customData: {
          notes: input.notes?.trim() || '',
        },
      },
    },
    token,
  );

  return data.createChildrenDaycare;
}

export async function updateDaycareChild(
  token: string,
  childId: string,
  input: {
    name: string;
    birthDate: string;
    gender: 'MALE' | 'FEMALE';
    notes?: string;
  }
) {
  const data = await graphqlRequest<UpdateChildResponse, { id: string; input: Record<string, unknown> }>(
    UPDATE_CHILD_MUTATION,
    {
      id: childId,
      input: {
        profile: {
          name: input.name.trim(),
          birthDate: input.birthDate,
          gender: input.gender,
        },
        customData: {
          notes: input.notes?.trim() || null,
        },
      },
    },
    token
  );

  return data.updateChildrenDaycare;
}

export async function updateDaycareChildDetails(
  token: string,
  childId: string,
  input: UpdateDaycareChildDetailsInput,
) {
  const data = await graphqlRequest<UpdateChildResponse, { id: string; input: UpdateDaycareChildDetailsInput }>(
    UPDATE_CHILD_MUTATION,
    {
      id: childId,
      input,
    },
    token,
  );

  return data.updateChildrenDaycare;
}

export async function deactivateDaycareChild(token: string, childId: string) {
  const data = await graphqlRequest<DeactivateChildResponse, { id: string }>(
    DEACTIVATE_CHILD_MUTATION,
    { id: childId },
    token
  );

  return data.deactivateChildrenDaycare;
}

export async function purgeDaycareChild(token: string, childId: string) {
  const data = await graphqlRequest<PurgeChildResponse, { id: string }>(
    PURGE_CHILD_MUTATION,
    { id: childId },
    token,
  );

  return data.purgeChildrenDaycare;
}
