import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Categories from '~/components/Categories';
import FiltersModal from '~/components/FiltersModal';
import ImageGrid from '~/components/ImageGrid';
import { theme } from '~/constants/theme';
import { hp, wp } from '~/helpers/common';
import { ApiResult, CategoriesResult } from '~/interfaces/apiResults';
import { apiCall } from '~/services/api';

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [images, setImages] = useState<ApiResult[]>([]);
  const [search, setSearch] = useState<string>('');
  const searchInputRef = useRef<TextInput>(null);
  const [activeCategory, setActiveCategory] = useState<CategoriesResult | null>(null);
  const [filters, setFilters] = useState<any | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = false) => {
    const response = await apiCall(params);
    if (response.hits) {
      setImages((prev) => (append ? [...prev, ...response.hits] : response.hits));
    }
  };

  const handleChangeCategory = (cat: CategoriesResult) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);
    const page = 1;
    let params = {
      page,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 2) {
      const page = 1;
      setImages([]);
      setActiveCategory(null); //reset category while searching
      fetchImages({ page, q: text }, false);
    }
    if (text == '') {
      const page = 1;
      setImages([]);
      setActiveCategory(null); //reset category while searching
      fetchImages({ page }, false);
    }
  };

  const clearSearch = () => {
    setSearch('');
    searchInputRef.current?.clear();
    setImages([]);
    fetchImages({ page: 1 });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  const openFiltersModal = () => {
    bottomSheetModalRef?.current?.present();
  };

  const closeFiltersModal = () => {
    bottomSheetModalRef?.current?.dismiss();
  };

  const applyFilters = () => {
    console.log('Filters Applied');
    closeFiltersModal();
  };
  const resetFilters = () => {
    console.log('Filters Applied');
    setFilters(null);
    closeFiltersModal();
  };

  console.log('Filters', filters);

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>

        <Pressable onPress={openFiltersModal}>
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
            //value={search}
            ref={searchInputRef}
            onChangeText={handleTextDebounce}
          />
          {search.length > 0 && (
            <Pressable onPress={clearSearch} style={styles.closeIcon}>
              <Ionicons name="close" size={24} color={theme.colors.neutral(0.4)} />
            </Pressable>
          )}
        </View>
        {/*Categories */}
        <View style={styles.categories}>
          <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
        </View>

        {/* Images */}
        <View>{images.length > 0 && <ImageGrid images={images} />}</View>
      </ScrollView>
      {/* Bottom Filter Modal */}
      <FiltersModal
        bottomSheetModalRef={bottomSheetModalRef}
        filters={filters}
        setFilters={setFilters}
        onApply={applyFilters}
        onReset={resetFilters}
        onClose={closeFiltersModal}
      />
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
  categories: {},
});
