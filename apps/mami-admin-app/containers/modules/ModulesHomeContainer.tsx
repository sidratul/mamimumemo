import { Screen } from '@mami/ui';
import { ModulesListSection } from './ModulesListSection';

export function ModulesHomeContainer() {
  return (
    <Screen title="Modules" subtitle="Container utama untuk kebutuhan system admin.">
      <ModulesListSection />
    </Screen>
  );
}
