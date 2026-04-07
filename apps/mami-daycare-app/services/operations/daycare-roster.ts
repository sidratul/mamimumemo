import { graphqlRequest } from '../graphql/client';

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
  childrenIds: Array<{ id: string }>;
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
  customData: {
    notes?: string | null;
  };
  active: boolean;
};

type RosterQueryResponse = {
  daycareParents: DaycareParent[];
  daycareChildren: DaycareChild[];
};

type RegisterParentResponse = {
  register: {
    id: string;
    message: string;
  };
};

type CreateParentResponse = {
  createParent: DaycareParent;
};

type CreateChildResponse = {
  createChildrenDaycare: DaycareChild;
};

type UpdateParentResponse = {
  updateParent: DaycareParent;
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
      childrenIds {
        id
      }
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
      customData {
        notes
      }
    }
  }
`;

const REGISTER_PARENT_MUTATION = `
  mutation RegisterParent($input: RegisterInput!) {
    register(input: $input) {
      id
      message
    }
  }
`;

const CREATE_PARENT_MUTATION = `
  mutation CreateParent($input: CreateParentInput!) {
    createParent(input: $input) {
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
      childrenIds {
        id
      }
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
      customData {
        notes
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
      childrenIds {
        id
      }
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
      customData {
        notes
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

export async function getDaycareRoster(token: string, daycareId: string) {
  const data = await graphqlRequest<RosterQueryResponse, { daycareId: string }>(
    DAYCARE_ROSTER_QUERY,
    { daycareId },
    token
  );

  return {
    parents: data.daycareParents,
    children: data.daycareChildren,
  };
}

export async function onboardFamily(token: string, input: FamilyEnrollmentInput) {
  const registerResult = await graphqlRequest<RegisterParentResponse, { input: Record<string, string> }>(
    REGISTER_PARENT_MUTATION,
    {
      input: {
        name: input.parentName.trim(),
        email: input.parentEmail.trim().toLowerCase(),
        password: input.parentPassword,
        phone: input.parentPhone.trim(),
        role: 'PARENT',
      },
    },
    token
  );

  const parentResult = await graphqlRequest<CreateParentResponse, { input: Record<string, unknown> }>(
    CREATE_PARENT_MUTATION,
    {
      input: {
        daycareId: input.daycareId,
        user: {
          userId: registerResult.register.id,
          name: input.parentName.trim(),
          email: input.parentEmail.trim().toLowerCase(),
          phone: input.parentPhone.trim(),
          role: 'PARENT',
        },
        customData: {
          notes: input.parentNotes?.trim() || null,
        },
      },
    },
    token
  );

  const childResult = await graphqlRequest<CreateChildResponse, { input: Record<string, unknown> }>(
    CREATE_CHILD_MUTATION,
    {
      input: {
        daycareId: input.daycareId,
        parentId: parentResult.createParent.id,
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
    parent: parentResult.createParent,
    child: childResult.createChildrenDaycare,
  };
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

export async function deactivateDaycareParent(token: string, parentId: string) {
  const data = await graphqlRequest<DeactivateParentResponse, { id: string }>(
    DEACTIVATE_PARENT_MUTATION,
    { id: parentId },
    token
  );

  return data.deactivateParent;
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

export async function deactivateDaycareChild(token: string, childId: string) {
  const data = await graphqlRequest<DeactivateChildResponse, { id: string }>(
    DEACTIVATE_CHILD_MUTATION,
    { id: childId },
    token
  );

  return data.deactivateChildrenDaycare;
}
