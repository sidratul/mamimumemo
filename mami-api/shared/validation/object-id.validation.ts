import { z } from "zod";

export const objectIdString = z.preprocess(
  (value) => {
    if (typeof value !== "object" || value === null) {
      return value;
    }

    const candidate = value as { id?: unknown; _id?: unknown; toString?: unknown };

    if (typeof candidate.id === "string") return candidate.id;
    if (typeof candidate._id === "string") return candidate._id;

    if (typeof candidate.toString === "function") {
      const next = candidate.toString();
      if (typeof next === "string" && next && next !== "[object Object]") {
        return next;
      }
    }

    return value;
  },
  z.string(),
);
