const LASTFM_API_KEY =
  process.env.LASTFM_API_KEY || "ce5373f4f375cc5249f471405657e238";
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

interface LastFmImage {
  "#text": string;
  size: string;
}

interface LastFmTrack {
  name: string;
  duration?: string | number;
  url?: string;
  artist?: {
    name: string;
    url?: string;
  };
}

interface LastFmAlbumResponse {
  album?: {
    name: string;
    artist: string;
    url?: string;
    image?: LastFmImage[];
    tracks?: {
      track: LastFmTrack[] | LastFmTrack;
    };
  };
  error?: number;
  message?: string;
}

export interface Track {
  name: string;
  artist: string;
  duration: number | null;
  url: string | null;
}

export interface AlbumInfo {
  albumCover: string | null;
  largeAlbumCover: string | null;
  url: string | null;
  tracks: Track[];
}

//Fetches album information from Last.fm API including tracks

export async function getAlbumInfo(
  artist: string,
  album: string
): Promise<AlbumInfo | null> {
  try {
    const params = new URLSearchParams({
      method: "album.getinfo",
      artist: artist,
      album: album,
      api_key: LASTFM_API_KEY,
      format: "json",
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      console.error(
        `Last.fm API error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data: LastFmAlbumResponse = await response.json();

    // Check if album was found
    if (data.error || !data.album) {
      return null;
    }

    // Get album covers
    const images = data.album.image || [];
    const mediumImage = images.find((img) => img.size === "medium");
    const largeImage = images.find(
      (img) => img.size === "large" || img.size === "extralarge"
    );

    // Process tracks
    const tracks: Track[] = [];

    if (data.album.tracks && data.album.tracks.track) {
      // Handle both single track and multiple tracks although pretty sure it will always come as array
      const trackData = Array.isArray(data.album.tracks.track)
        ? data.album.tracks.track
        : [data.album.tracks.track];

      trackData.forEach((track: LastFmTrack) => {
        tracks.push({
          name: track.name || "",
          artist: track.artist?.name || artist,
          duration: track.duration ? parseInt(track.duration.toString()) : null,
          url: track.url || null,
        });
      });
    }

    return {
      albumCover: mediumImage?.["#text"] || null,
      largeAlbumCover: largeImage?.["#text"] || null,
      url: data.album.url || null,
      tracks: tracks,
    };
  } catch (error) {
    console.error("Error fetching album info:", error);
    return null;
  }
}
