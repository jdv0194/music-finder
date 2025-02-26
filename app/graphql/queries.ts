import { gql } from "@apollo/client";

// Query to get all albums with optional filtering
export const GET_ALBUMS = gql`
  query GetAlbums($filter: AlbumFilterInput) {
    albums(filter: $filter) {
      id
      title
      artist
      genre
      releaseYear
      albumCover
      largeAlbumCover
      albumUrl
      isLiked
    }
  }
`;

// Query to get a single album by ID with track information
export const GET_ALBUM = gql`
  query GetAlbum($id: Int!) {
    album(id: $id) {
      id
      title
      artist
      genre
      releaseYear
      albumCover
      largeAlbumCover
      albumUrl
      isLiked
      tracks {
        id
        name
        artist
        duration
        url
      }
    }
  }
`;

// Query to get liked albums filter
export const GET_LIKED_ALBUMS = gql`
  query GetLikedAlbums {
    albums(filter: { likedOnly: true }) {
      id
      title
      artist
      genre
      releaseYear
      albumCover
      largeAlbumCover
      albumUrl
      isLiked
    }
  }
`;
