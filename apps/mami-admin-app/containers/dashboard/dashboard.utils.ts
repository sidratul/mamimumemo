import type { DimensionValue } from 'react-native';

export function toPercentWidth(value: number): DimensionValue {
  return `${value}%` as DimensionValue;
}
