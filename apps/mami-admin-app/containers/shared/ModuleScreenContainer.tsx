import { Screen, ScreenSection } from '@mami/ui';

import { Text } from '../../theme/theme';

type ModuleScreenContainerProps = {
  title: string;
  description: string;
  keyScreens: string[];
  keyActions: string[];
};

export function ModuleScreenContainer({
  title,
  description,
  keyScreens,
  keyActions,
}: ModuleScreenContainerProps) {
  return (
    <Screen title={title} subtitle={description}>
      <ScreenSection>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Screen Scope</Text>
        {keyScreens.map((screen) => (
          <Text key={screen}>• {screen}</Text>
        ))}
      </ScreenSection>

      <ScreenSection>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#24324B' }}>Actions</Text>
        {keyActions.map((action) => (
          <Text key={action}>• {action}</Text>
        ))}
      </ScreenSection>
    </Screen>
  );
}
