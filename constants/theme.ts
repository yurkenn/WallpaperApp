type fontWeights = {
  medium: string;
  semibold: string;
  bold: string;
};

type radius = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

type Theme = {
  colors: {
    white: string;
    black: string;
    grayBG: string;
    neutral: (opacity: number) => string;
  };
  fontWeights: fontWeights;
  radius: radius;
};

export const theme: Theme = {
  colors: {
    white: '#fff',
    black: '#000',
    grayBG: '#e5e5e5',

    neutral: (opacity: number) => `rgba(10, 10, 10, ${opacity})`,
  },
  fontWeights: {
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
  },
};
