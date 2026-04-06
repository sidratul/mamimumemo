/**
 * Mock Medical Records for Testing
 */

import { mockUsers } from "./users.mock.ts";
import { mockChildren } from "./children.mock.ts";

export const mockMedicalRecords = {
  illness: {
    _id: "65medrec001",
    childId: mockChildren.withAllergies._id,
    type: "ILLNESS",
    name: "Demam Berdarah",
    diagnosis: "DBD Grade II",
    symptoms: ["Demam tinggi 3 hari", "Bintik merah", "Mual"],
    startDate: "2026-02-20T00:00:00Z",
    endDate: "2026-02-25T00:00:00Z",
    status: "RECOVERED",
    severity: "HIGH",
    treatment: "Rawat inap 3 hari, infus, paracetamol",
    medications: [
      {
        name: "Paracetamol",
        dosage: "10mg/kgBB",
        frequency: "3x sehari",
        startDate: "2026-02-20T00:00:00Z",
        endDate: "2026-02-25T00:00:00Z",
      },
    ],
    doctor: {
      name: "Dr. Andi, Sp.A",
      hospital: "RS Anak Bunda",
      phone: "021-1234-5678",
    },
    reportedBy: {
      userId: mockUsers.parent._id,
      name: mockUsers.parent.name,
      relation: "mother",
    },
    createdAt: "2026-02-20T10:00:00Z",
    updatedAt: "2026-02-25T15:00:00Z",
  },
  allergy: {
    _id: "65medrec002",
    childId: mockChildren.withAllergies._id,
    type: "ALLERGY",
    name: "Alergi Susu Sapi",
    diagnosis: "Alergi protein susu sapi",
    symptoms: ["Ruam kulit", "Mual", "Diare"],
    startDate: "2026-01-15T00:00:00Z",
    endDate: null,
    status: "CHRONIC",
    severity: "MEDIUM",
    treatment: "Hindari produk susu sapi",
    medications: [],
    doctor: {
      name: "Dr. Budi, Sp.A",
      hospital: "Klinik Anak Sehat",
      phone: "021-4567-8901",
    },
    reportedBy: {
      userId: mockUsers.parent._id,
      name: mockUsers.parent.name,
      relation: "mother",
    },
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
};
