import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import SectionView, { ColorFilter, CommonFilterRow } from './FilterViews';

import { data } from '~/constants/data';
import { theme } from '~/constants/theme';
import { capitalize, hp } from '~/helpers/common';

type FiltersModalProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  filters: Record<string, string>;
  setFilters: (filters: Record<string, string>) => void;
  onApply: () => void;
  onClose: () => void;
  onReset: () => void;
};

const FiltersModal = ({
  bottomSheetModalRef,
  filters,
  setFilters,
  onApply,
  onClose,
  onReset,
}: FiltersModalProps) => {
  const snapPoints = useMemo(() => ['75%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={CustomBackdrop}>
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object.keys(sections).map((sectionName, index) => {
            const sectionView = sections[sectionName];
            const sectionData = data.filters[sectionName];
            const title = capitalize(sectionName);
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 100 + 100)
                  .springify()
                  .damping(11)}
                key={sectionName}>
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </Animated.View>
            );
          })}
          {/* actions */}
          <Animated.View
            entering={FadeInDown.delay(500).springify().damping(11)}
            style={styles.buttons}>
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text style={[styles.buttonText, { color: theme.colors.neutral(0.9) }]}>Reset</Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>Apply</Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  order: (props) => <CommonFilterRow {...props} />,
  orientation: (props) => <CommonFilterRow {...props} />,
  type: (props) => <CommonFilterRow {...props} />,
  colors: (props) => <ColorFilter {...props} />,
};

const CustomBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
    };
  });
  const containerStyle = [StyleSheet.absoluteFill, style, styles.overlay, containerAnimatedStyle];

  return (
    <Animated.View style={containerStyle}>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={25}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};
export default FiltersModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    //width: '100%',
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: '600',
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.03),
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    borderWidth: 2,
    borderColor: theme.colors.grayBG,
  },
  buttonText: {
    fontSize: hp(2.2),
  },
});
