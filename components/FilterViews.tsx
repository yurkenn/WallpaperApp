import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '~/constants/theme';
import { capitalize, hp } from '~/helpers/common';

type SectionViewProps = {
  content: JSX.Element;
  title: string;
};

const SectionView = ({ content, title }: SectionViewProps) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>SectionView</Text>
      <View>{content}</View>
    </View>
  );
};

export const CommonFilterRow = ({ data, filterName, filters, setFilters }) => {
  const onSelect = (item) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          const isActive = filters && filters[filterName] === item;
          const backgroundColor = isActive ? theme.colors.neutral(0.7) : theme.colors.white;
          const color = isActive ? theme.colors.white : theme.colors.neutral(0.7);
          return (
            <Pressable
              onPress={() => onSelect(item)}
              key={index}
              style={[styles.outlinedButton, { backgroundColor }]}>
              <Text style={[styles.outlinedButtonText, { color }]}>{capitalize(item)}</Text>
            </Pressable>
          );
        })}
    </View>
  );
};
export const ColorFilter = ({ data, filterName, filters, setFilters }) => {
  const onSelect = (item) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          const isActive = filters && filters[filterName] === item;
          const borderColor = isActive ? theme.colors.neutral(0.4) : theme.colors.white;
          return (
            <Pressable onPress={() => onSelect(item)} key={index}>
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View style={[styles.color, { backgroundColor: item }]}></View>
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

export default SectionView;

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: '500',
    color: theme.colors.neutral(0.8),
  },
  flexRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  outlinedButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
  },
  color: {
    height: 40,
    width: 40,
    borderRadius: theme.radius.sm - 3,
    borderCurve: 'continuous',
  },
  colorWrapper: {
    padding: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderCurve: 'continuous',
  },
});
