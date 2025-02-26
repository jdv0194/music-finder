// Album type
export interface Album {
  id: number;
  title: string;
  artist: string;
  genre: string;
  releaseYear: number;
  albumCover: string | null;
  largeAlbumCover: string | null;
  albumUrl: string | null;
  tracks?: Track[];
}

// Track type
export interface Track {
  id: number;
  name: string;
  artist: string;
  duration: number | null;
  url: string | null;
  albumId: number;
}

// Filter values
export interface FilterValues {
  genre: string;
  artist: string;
  year: number | "";
}
