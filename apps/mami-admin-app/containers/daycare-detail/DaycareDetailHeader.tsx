import { AppPageHeader } from '../../components/common/AppPageHeader';

type DaycareDetailHeaderProps = {
  title: string;
  onBack: () => void;
};

export function DaycareDetailHeader({ title, onBack }: DaycareDetailHeaderProps) {
  return <AppPageHeader title={title} onBack={onBack} />;
}
