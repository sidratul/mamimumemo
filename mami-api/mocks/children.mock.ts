/**
 * Mock Children for Testing
 */

import { mockUsers } from "./users.mock.ts";

export const mockChildren = {
  withAllergies: {
    _id: "65child001",
    ownerId: mockUsers.parent._id,
    profile: {
      name: "Budi Santoso",
      birthDate: "2023-01-15T00:00:00Z",
      photo: "https://example.com/budi.jpg",
      gender: "MALE",
    },
    medical: {
      allergies: ["Susu sapi", "Kacang"],
      medicalNotes: "Perlu inhaler setiap malam",
      medications: [
        {
          name: "Ventolin",
          dosage: "2 puff",
          schedule: "Setiap malam sebelum tidur",
        },
      ],
    },
    guardians: [
      {
        user: mockUsers.parent,
        relation: "MOTHER",
        permissions: [
          "VIEW_REPORTS",
          "INPUT_ACTIVITY",
          "INPUT_HEALTH",
          "ENROLL_DAYCARE",
          "EDIT_PROFILE",
          "MANAGE_GUARDIANS",
        ],
        sharedAt: "2026-01-15T10:00:00Z",
        sharedBy: {
          userId: mockUsers.parent._id,
          name: "Ibu Budi",
          relation: "mother",
        },
        active: true,
      },
      {
        user: mockUsers.guardian,
        relation: "FATHER",
        permissions: [
          "VIEW_REPORTS",
          "INPUT_ACTIVITY",
          "INPUT_HEALTH",
        ],
        sharedAt: "2026-01-15T10:00:00Z",
        sharedBy: {
          userId: mockUsers.parent._id,
          name: "Ibu Budi",
          relation: "mother",
        },
        active: true,
      },
    ],
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-02-20T14:30:00Z",
  },
  healthy: {
    _id: "65child002",
    ownerId: "65parent002",
    profile: {
      name: "Siti Aminah",
      birthDate: "2023-03-20T00:00:00Z",
      photo: "https://example.com/siti.jpg",
      gender: "FEMALE",
    },
    medical: {
      allergies: [],
      medicalNotes: "",
      medications: [],
    },
    guardians: [
      {
        user: {
          userId: "65parent002",
          name: "Ibu Siti",
          email: "ibu.siti@example.com",
          phone: "0813-4567-8901",
          role: "PARENT",
        },
        relation: "MOTHER",
        permissions: [
          "VIEW_REPORTS",
          "INPUT_ACTIVITY",
          "INPUT_HEALTH",
          "ENROLL_DAYCARE",
          "EDIT_PROFILE",
          "MANAGE_GUARDIANS",
        ],
        sharedAt: "2026-01-20T10:00:00Z",
        sharedBy: {
          userId: "65parent002",
          name: "Ibu Siti",
          relation: "mother",
        },
        active: true,
      },
    ],
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-02-20T14:30:00Z",
  },
};
