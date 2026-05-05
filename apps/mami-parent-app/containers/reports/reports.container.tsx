import { Screen, TextMuted } from '@mami/ui';
import { View } from 'react-native';

export function ReportsContainer() {
  return (
    <Screen title="Laporan" subtitle="Placeholder laporan untuk parent.">
      <View style={{ gap: 12 }}>
        <TextMuted>- Laporan makan mingguan</TextMuted>
        <TextMuted>- Laporan aktivitas harian</TextMuted>
        <TextMuted>- Laporan tidur dan kesehatan</TextMuted>
      </View>
    </Screen>
  );
}
