import { GraphQLContext } from "../context";
import { comparePasswords, generateToken, hashPassword } from "@/lib/auth";

export const authResolvers = {
  Mutation: {
    // Register a new user
    register: async (
      _: any,
      { input }: { input: { email: string; password: string; name?: string } },
      { prisma }: GraphQLContext
    ) => {
      const { email, password, name } = input;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create the user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
        },
      });

      // Generate a token
      const token = generateToken(user);

      return {
        token,
        user,
      };
    },

    // Login a user
    login: async (
      _: any,
      { input }: { input: { email: string; password: string } },
      { prisma }: GraphQLContext
    ) => {
      const { email, password } = input;

      // Find the user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Check password
      const passwordValid = await comparePasswords(password, user.password);

      if (!passwordValid) {
        throw new Error("Invalid email or password");
      }

      // Generate a token
      const token = generateToken(user);

      return {
        token,
        user,
      };
    },
  },

  Query: {
    // Get the current user
    me: async (_: any, __: any, { prisma, userId }: GraphQLContext) => {
      if (!userId) {
        return null;
      }

      return prisma.user.findUnique({
        where: { id: userId },
        include: {
          likedAlbums: {
            include: {
              album: true,
            },
          },
        },
      });
    },
  },

  // Resolve liked albums for User type
  User: {
    likedAlbums: async (parent: any, _: any, { prisma }: GraphQLContext) => {
      const likedAlbums = await prisma.likedAlbum.findMany({
        where: { userId: parent.id },
        include: { album: true },
      });

      return likedAlbums.map((like) => like.album);
    },
  },
};
