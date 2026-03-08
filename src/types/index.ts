export interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: [string, string];
}

export interface GeneratedPhoto {
  id: string;
  uri: string;
  themeId: string;
  themeName: string;
}

export type RootStackParamList = {
  Upload: undefined;
  Processing: { sourceUri: string; selectedThemes: Theme[] };
  Gallery: { photos: GeneratedPhoto[] };
  Slider: { photos: GeneratedPhoto[]; initialIndex: number };
};
