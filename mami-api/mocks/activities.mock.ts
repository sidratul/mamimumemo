/**
 * Mock Activities for Testing
 */

import { mockUsers } from "./users.mock.ts";
import { mockChildren } from "./children.mock.ts";
import { mockDaycares } from "./daycares.mock.ts";

export const mockActivities = {
  meal: {
    _id: "65activity001",
    childId: mockChildren.withAllergies._id,
    daycareId: null,
    activityName: "Makan Siang",
    category: "MEAL",
    date: "2026-02-23T00:00:00Z",
    startTime: "11:00",
    endTime: "11:45",
    duration: 45,
    mealType: "LUNCH",
    menu: "Nasi, ayam, sayur",
    eaten: "ALL",
    mood: "HAPPY",
    photos: ["https://example.com/activity1.jpg"],
    description: "Habiskan semua makanannya",
    source: "PARENT",
    loggedBy: {
      userId: mockUsers.parent._id,
      name: mockUsers.parent.name,
      relation: "mother",
      role: "PARENT",
    },
    createdAt: "2026-02-23T11:45:00Z",
    updatedAt: "2026-02-23T11:45:00Z",
  },
  nap: {
    _id: "65activity002",
    childId: mockChildren.withAllergies._id,
    daycareId: mockDaycares.active._id,
    activityName: "Tidur Siang",
    category: "NAP",
    date: "2026-02-23T00:00:00Z",
    startTime: "12:00",
    endTime: "14:00",
    duration: 120,
    quality: "GOOD",
    mood: "SLEEPY",
    photos: [],
    description: "Tidur nyenyak",
    source: "DAYCARE",
    loggedBy: {
      userId: mockUsers.daycareSitter._id,
      name: mockUsers.daycareSitter.name,
      relation: "sitter",
      role: "DAYCARE_SITTER",
    },
    createdAt: "2026-02-23T14:00:00Z",
    updatedAt: "2026-02-23T14:00:00Z",
  },
};
