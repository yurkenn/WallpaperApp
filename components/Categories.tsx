import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { data } from '~/constants/data';
import { theme } from '~/constants/theme';
import { hp, wp } from '~/helpers/common';

const Categories = ({ activeCategory, handleChangeCategory }) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.flatlistContainer}
      showsHorizontalScrollIndicator={false}
      data={data.categories}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <CategoryItem
          isActive={activeCategory == item}
          handleChangeCategory={handleChangeCategory}
          title={item}
          index={index}
        />
      )}
    />
  );
};

const CategoryItem = ({ title, index, isActive, handleChangeCategory }) => {
  return (
    <View>
      <Pressable
        onPress={() => handleChangeCategory(isActive ? null : title)}
        style={[styles.category]}>
        <Text style={[styles.title]}>{title}</Text>
      </Pressable>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
  category: {
    padding: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    backgroundColor: 'white',
    borderCurve: 'continuous',
  },
  title: {
    color: theme.colors.black,
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium,
  },
});
