import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
  const scrollRef = useRef<ScrollView>(null);
  const [isEndReached, setIsEndReached] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = false) => {
    console.log('params:', params, append);
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
    const params = {
      page,
      ...filters,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };

  const handleSearch = (text) => {
    if (text.length > 2) {
      setSearch(text);
      setImages([]);
      setActiveCategory(null);
      const page = 1;
      const params = {
        ...filters,
        page,
        q: text,
      };
      if (activeCategory) params.category = activeCategory;
      fetchImages(params, false);
    }

    if (text.length === 0) {
      clearSearch();
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
    if (filters) {
      const page = 1;
      setImages([]);
      const params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModal();
  };
  const resetFilters = () => {
    if (filters) {
      const page = 1;
      setFilters(null);
      setImages([]);
      const params = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModal();
  };

  const clearThisFilter = (key) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);

    const page = 1;
    setImages([]);
    const params = {
      page,
      ...newFilters,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        const page = Math.floor(images.length / 20) + 1;
        const params = { page, ...filters };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params, true);
        console.log('End Reached');
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleScrollUp = () => {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>

        <Pressable onPress={openFiltersModal}>
          <FontAwesome6 name="bars-staggered" size={22} color={theme.colors.neutral(0.7)} />
        </Pressable>
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}>
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
        {/* filters */}
        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}>
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {key === 'colors' && (
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 20,
                          backgroundColor: filters[key],
                        }}
                      />
                    )}
                    <Text style={styles.filterItemText}>{filters[key]}</Text>
                    <Pressable style={styles.filterCloseIcon} onPress={() => clearThisFilter(key)}>
                      <Ionicons name="close" size={14} color={theme.colors.neutral(0.9)} />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Images */}
        <View>{images.length > 0 && <ImageGrid images={images} />}</View>

        {/* Loading */}
        <View style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}>
          <ActivityIndicator size="large" />
        </View>
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
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: theme.radius.xs,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  filterItemText: {
    fontSize: hp(1.8),
  },
  filterCloseIcon: {
    marginLeft: 5,
    backgroundColor: theme.colors.neutral(0.2),
    padding: 5,
    borderRadius: theme.radius.xs,
  },
});
