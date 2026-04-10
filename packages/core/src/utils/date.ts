type DateValue = string | number | Date;

export function formatDateId(value: DateValue, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

export function formatDateTimeId(value: DateValue, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}
