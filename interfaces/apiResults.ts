export interface CategoriesResult {
  backgrounds: string;
  fashion: string;
  nature: string;
  science: string;
  education: string;
  feelings: string;
  health: string;
  people: string;
  religion: string;
  places: string;
  animals: string;
  industry: string;
  computer: string;
  food: string;
  sports: string;
  transportation: string;
  travel: string;
  buildings: string;
  business: string;
  music: string;
}

export interface RootObject {
  total: number;
  totalHits: number;
  hits: ApiResult[];
}

export interface ApiResult {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  collections: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface Params {
  [key: string]: string | number;
}
