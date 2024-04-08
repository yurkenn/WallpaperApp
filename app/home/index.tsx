import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Categories from '~/components/Categories';

import { theme } from '~/constants/theme';
import { hp, wp } from '~/helpers/common';

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const [search, setSearch] = useState<string>('');
  const searchInputRef = useRef<TextInput>(null);

  const [activeCategory, setActiveCategory] = useState(null);

  const handleChangeCategory = (category) => {
    setActiveCategory(category);
  };
  console.log('activeCategory', activeCategory);

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>

        <Pressable>
          <FontAwesome6 name="bars-staggered" size={22} color={theme.colors.neutral(0.7)} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ gap: 15 }}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather name="search" size={24} color={theme.colors.neutral(0.4)} />
          </View>
          <TextInput
            placeholder="Search for photos..."
            style={styles.searchInput}
            value={search}
            ref={searchInputRef}
            onChangeText={(value) => setSearch(value)}
          />
          {search.length > 0 && (
            <Pressable onPress={{}} style={styles.closeIcon}>
              <Ionicons name="close" size={24} color={theme.colors.neutral(0.4)} />
            </Pressable>
          )}
        </View>
        {/*Categories */}
        <View style={styles.categories}>
          <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.neutral(0.9),
  },

  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },

  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.8),
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
  },
  closeIcon: {
    marginLeft: 10,
  },
});
