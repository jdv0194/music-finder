import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
    likedAlbums: [Album!]
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Track {
    id: Int!
    name: String!
    artist: String!
    duration: Int
    url: String
    albumId: Int!
  }

  type Album {
    id: Int!
    title: String!
    artist: String!
    genre: String!
    releaseYear: Int!
    createdAt: String!
    updatedAt: String!
    albumCover: String
    largeAlbumCover: String
    albumUrl: String
    tracks: [Track!]
    isLiked: Boolean
  }

  input AlbumFilterInput {
    genre: String
    artist: String
    releaseYear: Int
    likedOnly: Boolean
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String
  }

  input AddTrackInput {
    name: String!
    artist: String!
    duration: Int
    url: String
  }

  input AddAlbumInput {
    title: String!
    artist: String!
    albumCover: String
    largeAlbumCover: String
    albumUrl: String
    genre: String
    releaseYear: Int
    tracks: [AddTrackInput!]
  }

  type Query {
    albums(filter: AlbumFilterInput): [Album!]!
    album(id: Int!): Album
    me: User
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    likeAlbum(albumId: Int!): Album!
    unlikeAlbum(albumId: Int!): Album!
    addAlbum(input: AddAlbumInput!): Album!
  }
`;
