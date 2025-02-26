import { PrismaClient } from "@prisma/client";
import { getAlbumInfo } from "../lib/lastfm-api";

const prisma = new PrismaClient();

async function populateAlbumInfo() {
  console.log("Starting to populate album information...");

  try {
    const albums = await prisma.album.findMany();

    for (const album of albums) {
      console.log(`Processing album: ${album.title} by ${album.artist}`);

      try {
        const albumInfo = await getAlbumInfo(album.artist, album.title);

        if (albumInfo) {
          await prisma.album.update({
            where: { id: album.id },
            data: {
              albumCover: albumInfo.albumCover,
              largeAlbumCover: albumInfo.largeAlbumCover,
              albumUrl: albumInfo.url,
            },
          });

          console.log(`Updated album cover for ${album.title}`);

          await prisma.track.deleteMany({
            where: { albumId: album.id },
          });

          if (albumInfo.tracks && albumInfo.tracks.length > 0) {
            const trackData = albumInfo.tracks.map((track, index) => ({
              name: track.name,
              artist: track.artist,
              duration: track.duration,
              url: track.url,
              albumId: album.id,
            }));

            await prisma.track.createMany({
              data: trackData,
            });

            console.log(`Added ${trackData.length} tracks to ${album.title}`);
          }

          // Add a small delay to avoid hitting API rate limits
          await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
          console.log(`No album info found for ${album.title}`);
        }
      } catch (error) {
        console.error(`Error processing ${album.title}:`, error);
      }
    }

    console.log("Finished populating album information!");
  } catch (error) {
    console.error("Error in population script:", error);
  } finally {
    await prisma.$disconnect();
  }
}

populateAlbumInfo();
