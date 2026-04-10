import { useEffect, useRef } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

type BottomDrawerProps = {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  paddingHorizontal?: number;
};

export function BottomDrawer({
  visible,
  onDismiss,
  children,
  paddingHorizontal = 16,
}: BottomDrawerProps) {
  const modalRef = useRef<BottomSheetModal>(null);
  const { height } = useWindowDimensions();

  useEffect(() => {
    if (visible) {
      modalRef.current?.present();
      return;
    }

    modalRef.current?.dismiss();
  }, [visible]);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      enableDynamicSizing
      maxDynamicContentSize={Math.round(height * 0.85)}
      enablePanDownToClose
      enableOverDrag={false}
      onDismiss={onDismiss}
      keyboardBehavior={Platform.OS === 'ios' ? 'interactive' : 'fillParent'}
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
      )}
      handleIndicatorStyle={{
        backgroundColor: '#D7DDEA',
        width: 42,
        height: 4,
      }}
      backgroundStyle={{
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}>
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: 8,
          paddingBottom: 24,
          gap: 16,
        }}>
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

export { BottomSheetModalProvider };
