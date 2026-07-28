export function normalizeObjectId(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    const candidate = value as { id?: unknown; _id?: unknown; toString?: unknown };

    if (typeof candidate.id === 'string') return candidate.id;
    if (typeof candidate._id === 'string') return candidate._id;

    if (typeof candidate.toString === 'function') {
      const next = candidate.toString();
      if (next && next !== '[object Object]') return next;
    }
  }

  return '';
}
