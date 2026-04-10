export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function getDocumentName(value: string) {
  if (!value) {
    return 'Belum ada file';
  }

  try {
    const parsed = new URL(value);
    const parts = parsed.pathname.split('/').filter(Boolean);
    return decodeURIComponent(parts[parts.length - 1] || value);
  } catch {
    const parts = value.split('/').filter(Boolean);
    return decodeURIComponent(parts[parts.length - 1] || value);
  }
}
