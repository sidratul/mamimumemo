export function parseTimeString(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23) return null;
  if (minutes < 0 || minutes > 59) return null;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function formatTimeString(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function addMinutesToTime(value: string, minutes: number) {
  const parsed = parseTimeString(value);
  if (!parsed || !Number.isFinite(minutes)) return '';

  const next = new Date(parsed);
  next.setMinutes(next.getMinutes() + minutes);
  return formatTimeString(next);
}
