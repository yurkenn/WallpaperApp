import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '~/constants/theme';

import { getImageSize, wp } from '~/helpers/common';

const ImageCard = ({ item, index, columns }) => {
  const isLastinRow = () => {
    return (index + 1) % columns === 0;
  };

  const getImageHeight = () => {
    const { imageHeight: height, imageWidth: width } = item;
    return {
      height: getImageSize(height, width),
    };
  };

  return (
    <Pressable style={[styles.imageWrapper, !isLastinRow() && styles.spacing]}>
      <Image
        style={[styles.image, getImageHeight()]}
        transition={100}
        source={{ uri: item?.webformatURL }}
      />
    </Pressable>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  imageWrapper: {
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.grayBG,
    borderCurve: 'continuous',
    overflow: 'hidden',
    marginBottom: wp(4),
  },
  spacing: {
    marginRight: wp(2),
  },
});
