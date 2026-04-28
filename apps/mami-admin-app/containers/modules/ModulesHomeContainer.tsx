import { ScreenHeader } from '@mami/ui';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenContainer } from '../../components/common/ScreenContainer';
import { ModulesListSection } from './ModulesListSection';

export function ModulesHomeContainer() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <ScreenContainer>
        <ScreenHeader title="Modules" subtitle="Container utama untuk kebutuhan system admin." />
        <ModulesListSection />
      </ScreenContainer>
    </SafeAreaView>
  );
}
