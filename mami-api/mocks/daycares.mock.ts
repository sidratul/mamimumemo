/**
 * Mock Daycares for Testing
 */

import { mockUsers } from "./users.mock.ts";

export const mockDaycares = {
  active: {
    _id: "65daycare001",
    name: "Daycare Ceria",
    address: "Jl. Merdeka No. 123",
    phone: "021-1234-5678",
    email: "info@daycareceria.com",
    owner: mockUsers.daycareOwner,
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  pending: {
    _id: "65daycare002",
    name: "Daycare Baru",
    address: "Jl. Baru No. 456",
    phone: "021-4567-8901",
    email: "info@daycarebaru.com",
    owner: mockUsers.daycareOwner,
    status: "pending",
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-02-01T00:00:00Z",
  },
};
