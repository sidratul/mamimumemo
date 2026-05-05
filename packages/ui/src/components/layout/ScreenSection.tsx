import { ReactNode } from 'react';
import { View } from 'react-native';

import { SectionCard } from '../primitives/SectionCard';

type ScreenSectionProps = {
  children: ReactNode;
  padded?: boolean;
  gap?: number;
};

export function ScreenSection({ children, padded = true, gap = 12 }: ScreenSectionProps) {
  return <View style={padded ? { paddingHorizontal: 16 } : undefined}><SectionCard gap={gap}>{children}</SectionCard></View>;
}
