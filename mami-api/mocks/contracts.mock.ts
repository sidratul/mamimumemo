/**
 * Mock Contracts for Testing
 */

import { mockDaycares } from "./daycares.mock.ts";
import { mockUsers } from "./users.mock.ts";
import { mockChildren } from "./children.mock.ts";

export const mockContracts = {
  monthly: {
    _id: "65contract001",
    daycareId: mockDaycares.active._id,
    parentId: mockUsers.parent._id,
    childIds: [mockChildren.withAllergies._id],
    serviceType: "MONTHLY",
    price: 500000,
    startDate: "2026-03-01T00:00:00Z",
    endDate: "2026-03-31T00:00:00Z",
    status: "ACTIVE",
    terms: "Pembayaran di awal bulan",
    createdAt: "2026-02-25T10:00:00Z",
    updatedAt: "2026-02-25T10:00:00Z",
  },
  weekly: {
    _id: "65contract002",
    daycareId: mockDaycares.active._id,
    parentId: "65parent002",
    childIds: [mockChildren.healthy._id],
    serviceType: "WEEKLY",
    price: 150000,
    startDate: "2026-03-01T00:00:00Z",
    endDate: "2026-03-07T00:00:00Z",
    status: "ACTIVE",
    terms: "Pembayaran di awal minggu",
    createdAt: "2026-02-26T10:00:00Z",
    updatedAt: "2026-02-26T10:00:00Z",
  },
  expired: {
    _id: "65contract003",
    daycareId: mockDaycares.active._id,
    parentId: mockUsers.parent._id,
    childIds: [mockChildren.withAllergies._id],
    serviceType: "MONTHLY",
    price: 500000,
    startDate: "2026-02-01T00:00:00Z",
    endDate: "2026-02-28T00:00:00Z",
    status: "EXPIRED",
    terms: "Pembayaran di awal bulan",
    createdAt: "2026-01-25T10:00:00Z",
    updatedAt: "2026-02-28T23:59:59Z",
  },
};
