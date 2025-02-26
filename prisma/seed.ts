import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.album.deleteMany();

  const albumsData = [
    {
      title: "Abbey Road",
      artist: "The Beatles",
      genre: "Rock",
      releaseYear: 1969,
    },
    {
      title: "Thriller",
      artist: "Michael Jackson",
      genre: "Pop",
      releaseYear: 1982,
    },
    {
      title: "Dark Side of the Moon",
      artist: "Pink Floyd",
      genre: "Progressive Rock",
      releaseYear: 1973,
    },
    {
      title: "Back to Black",
      artist: "Amy Winehouse",
      genre: "Soul",
      releaseYear: 2006,
    },
    {
      title: "Rumours",
      artist: "Fleetwood Mac",
      genre: "Rock",
      releaseYear: 1977,
    },
    {
      title: "Ready to Die",
      artist: "The Notorious B.I.G.",
      genre: "Hip-Hop",
      releaseYear: 1994,
    },
    {
      title: "Confessions",
      artist: "Usher",
      genre: "R&B",
      releaseYear: 2004,
    },
  ];
  console.log("Starting to seed the database...");

  // Insert all albums
  for (const album of albumsData) {
    const createdAlbum = await prisma.album.create({
      data: album,
    });
    console.log(`Created album: ${createdAlbum.title}`);
  }

  console.log("Database seeding completed!");
};

main()
  .catch((e) => {
    console.error("Error seeding the database:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the Prisma client
    await prisma.$disconnect();
  });
