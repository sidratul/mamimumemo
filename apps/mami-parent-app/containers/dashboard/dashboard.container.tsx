import { Screen, TextMuted } from '@mami/ui';
import { View } from 'react-native';

export function DashboardContainer() {
  return (
    <Screen title="Dashboard" subtitle="Parent app memakai route groups, container per page, dan primitive shared.">
      <View style={{ gap: 12 }}>
        <TextMuted>- Ringkasan kehadiran anak minggu ini</TextMuted>
        <TextMuted>- Aktivitas terbaru dari daycare</TextMuted>
        <TextMuted>- Tagihan dan status pembayaran</TextMuted>
      </View>
    </Screen>
  );
}
