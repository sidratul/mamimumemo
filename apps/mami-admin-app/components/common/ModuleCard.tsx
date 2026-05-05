import { ActionTile } from '@mami/ui';

type ModuleCardProps = {
  title: string;
  description: string;
  onPress: () => void;
};

export function ModuleCard({ title, description, onPress }: ModuleCardProps) {
  return <ActionTile title={title} description={description} onPress={onPress} />;
}
