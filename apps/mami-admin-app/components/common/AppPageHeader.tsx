import { PageHeader } from '@mami/ui';

type AppPageHeaderProps = {
  title: string;
  onBack?: () => void;
  backgroundColor?: string;
  borderBottomColor?: string;
};

export function AppPageHeader({
  title,
  onBack,
  backgroundColor = '#F7F9FC',
  borderBottomColor = '#E8ECF4',
}: AppPageHeaderProps) {
  return <PageHeader title={title} onBack={onBack} backgroundColor={backgroundColor} borderBottomColor={borderBottomColor} />;
}
