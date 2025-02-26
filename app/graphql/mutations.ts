import { gql } from "@apollo/client";

// User Registration
export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

// User Login
export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

// Like an Album
export const LIKE_ALBUM = gql`
  mutation LikeAlbum($albumId: Int!) {
    likeAlbum(albumId: $albumId) {
      id
      title
      artist
      isLiked
    }
  }
`;

// Unlike an Album
export const UNLIKE_ALBUM = gql`
  mutation UnlikeAlbum($albumId: Int!) {
    unlikeAlbum(albumId: $albumId) {
      id
      title
      artist
      isLiked
    }
  }
`;

// Get Current User
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      name
      likedAlbums {
        id
        title
        artist
        albumCover
        largeAlbumCover
        isLiked
      }
    }
  }
`;

// Refresh stale data
export const REFRESH_USER_DATA = gql`
  mutation RefreshUserData {
    refreshUserData {
      id
      email
      name
      likedAlbums {
        id
        title
        artist
        albumCover
        largeAlbumCover
        isLiked
      }
    }
  }
`;

export const GET_ALBUM_LIKE_STATUS = gql`
  query GetAlbumLikeStatus($albumId: Int!) {
    albumLikeStatus(albumId: $albumId) {
      isLiked
    }
  }
`;

export const ADD_ALBUM = gql`
  mutation AddAlbum($input: AddAlbumInput!) {
    addAlbum(input: $input) {
      id
      title
      artist
      albumCover
      largeAlbumCover
      releaseYear
      genre
      tracks {
        id
        name
        duration
      }
    }
  }
`;
