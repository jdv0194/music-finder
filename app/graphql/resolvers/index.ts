import { authResolvers } from "./auth";
import { albumResolvers } from "./album";

// Merge all resolver maps
export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...albumResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...albumResolvers.Mutation,
  },
  Album: albumResolvers.Album,
  User: authResolvers.User,
};
