import { GraphQLContext } from "../context";

export const albumResolvers = {
  Query: {
    // Get all albums with optional filters
    albums: async (
      _: any,
      { filter = {} }: { filter: any },
      { prisma, userId }: GraphQLContext
    ) => {
      const { genre, artist, releaseYear, likedOnly } = filter;

      // Build the filter object for Prisma
      const where: any = {};

      if (genre) {
        where.genre = genre;
      }

      if (artist) {
        where.artist = {
          contains: artist,
          mode: "insensitive",
        };
      }

      if (releaseYear) {
        where.releaseYear = releaseYear;
      }

      if (likedOnly && userId) {
        where.likedBy = {
          some: {
            userId,
          },
        };
      }

      // Query the database using Prisma
      const albums = await prisma.album.findMany({
        where,
        include: {
          tracks: true,
          likedBy: {
            where: userId ? { userId } : undefined,
          },
        },
        orderBy: {
          title: "asc",
        },
      });

      return albums;
    },

    // Get a single album by ID probably need this when isolating album for tracks
    album: async (
      _: any,
      { id }: { id: number },
      { prisma, userId }: GraphQLContext
    ) => {
      return prisma.album.findUnique({
        where: { id },
        include: {
          tracks: true,
          likedBy: {
            where: userId ? { userId } : undefined,
          },
        },
      });
    },
  },

  Mutation: {
    addAlbum: async (
      _: any,
      { input }: { input: any },
      { prisma, userId }: GraphQLContext
    ) => {
      const existingAlbum = await prisma.album.findFirst({
        where: {
          title: input.title,
          artist: input.artist,
        },
      });
      if (existingAlbum) {
        return existingAlbum;
      }

      // Set default values if fields are missing dont think fm api has genre and release year
      const genre = input.genre || "Unknown";
      const releaseYear = input.releaseYear || new Date().getFullYear();
      const albumCover = input.albumCover || "";
      const largeAlbumCover = input.largeAlbumCover || "";
      const albumUrl = input.albumUrl || "";

      const album = await prisma.album.create({
        data: {
          title: input.title,
          artist: input.artist,
          albumCover,
          largeAlbumCover,
          albumUrl,
          genre,
          releaseYear,
          tracks: input.tracks ? { create: input.tracks } : undefined,
        },
        include: {
          tracks: true,
          likedBy: userId ? { where: { userId } } : undefined,
        },
      });
      return album;
    },

    // Like an album
    likeAlbum: async (
      _: any,
      { albumId }: { albumId: number },
      { prisma, userId }: GraphQLContext
    ) => {
      if (!userId) {
        throw new Error("You must be logged in to like an album");
      }

      // Check if the album exists
      const album = await prisma.album.findUnique({
        where: { id: albumId },
      });

      if (!album) {
        throw new Error("Album not found");
      }

      // Check if the user has already liked this album
      const existingLike = await prisma.likedAlbum.findUnique({
        where: {
          userId_albumId: {
            userId,
            albumId,
          },
        },
      });

      if (!existingLike) {
        // Create the like
        await prisma.likedAlbum.create({
          data: {
            userId,
            albumId,
          },
        });
      }

      // Return the album with updated like status
      return prisma.album.findUnique({
        where: { id: albumId },
        include: {
          tracks: true,
          likedBy: {
            where: { userId },
          },
        },
      });
    },

    // Unlike an album
    unlikeAlbum: async (
      _: any,
      { albumId }: { albumId: number },
      { prisma, userId }: GraphQLContext
    ) => {
      if (!userId) {
        throw new Error("You must be logged in to unlike an album");
      }

      // Check if the album exists
      const album = await prisma.album.findUnique({
        where: { id: albumId },
      });

      if (!album) {
        throw new Error("Album not found");
      }

      // Delete the like
      await prisma.likedAlbum.deleteMany({
        where: {
          userId,
          albumId,
        },
      });

      // Return the album with updated like status
      return prisma.album.findUnique({
        where: { id: albumId },
        include: {
          tracks: true,
          likedBy: {
            where: { userId },
          },
        },
      });
    },
  },

  // Resolve custom fields for Album type
  Album: {
    isLiked: (parent: any, _: any, { userId }: GraphQLContext) => {
      if (!userId || !parent.likedBy) {
        return false;
      }

      return parent.likedBy.length > 0;
    },
  },
};
