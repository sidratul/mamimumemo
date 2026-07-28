import { useMemo } from 'react';

import { SearchableSelectInputBase, type SearchableSelectOption } from './SearchableSelectInputBase';
import type { MasterActivity } from '../../services/operations/schedule-planning';

type ActivitySourceSelectInputProps = {
  value?: string;
  activities: MasterActivity[];
  categoryLabelMap?: Map<string, string>;
  placeholder?: string;
  title?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

export function ActivitySourceSelectInput({
  value,
  activities,
  categoryLabelMap,
  placeholder = 'Pilih aktivitas',
  title = 'Pilih aktivitas',
  searchPlaceholder = 'Cari aktivitas...',
  emptyText = 'Belum ada aktivitas.',
  disabled,
  error,
  onChange,
}: ActivitySourceSelectInputProps) {
  const options = useMemo<SearchableSelectOption[]>(
    () =>
      activities.map((activity) => ({
        label: activity.name,
        value: activity.id,
        description: `${categoryLabelMap?.get(activity.category.toUpperCase()) ?? activity.category} · ${activity.defaultDuration} menit`,
      })),
    [activities, categoryLabelMap]
  );

  return (
    <SearchableSelectInputBase
      value={value}
      options={options}
      placeholder={placeholder}
      title={title}
      searchPlaceholder={searchPlaceholder}
      emptyText={emptyText}
      disabled={disabled}
      error={error}
      onChange={onChange}
    />
  );
}
