import { Dimensions } from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export const wp = (percentage: number) => {
  const width = deviceWidth;
  return (percentage * width) / 100;
};

export const hp = (percentage: number) => {
  const height = deviceHeight;
  return (percentage * height) / 100;
};

export const getColumnCount = (width: number) => {
  if (deviceWidth >= 1024) {
    return 4;
  }
  if (deviceWidth >= 768) {
    return 3;
  }
  if (deviceWidth >= 414) {
    return 2;
  }
};

export const getImageSize = (height: number, width: number) => {
  if (width > height) {
    return 250;
    // landscape
  } else if (width < height) {
    return 300;
    // portrait
  } else {
    return 200;
    // square
  }
};

export const capitalize = (str: string) => {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
};
