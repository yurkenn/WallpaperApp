import { Params, RootObject } from '~/interfaces/apiResults';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const apiURL = `https://pixabay.com/api/?key=${API_KEY}`;

const formatURL = (params: Params) => {
  let url = apiURL + '&per_page=25&safesearch=true&editors_choice=true';
  if (!params) return url;

  const paramKeys = Object.keys(params);
  paramKeys.map((key, index) => {
    const value = key === 'q' ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });
  console.log('final url', url);
  return url;
};

export const apiCall = async (params: Params): Promise<RootObject> => {
  try {
    const response = await fetch(formatURL(params));
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(`API call failed: ${error.message}`);
  }
};
