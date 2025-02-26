"use client";

import { use } from "react";
import { useQuery } from "@apollo/client";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Paper,
  CardMedia,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TrackList } from "@/components/Albums";
import { GET_ALBUM } from "@/app/graphql";

// Default album cover image
const DEFAULT_ALBUM_COVER = "/cover.png";

interface SlugParams {
  slug: string[];
}

export default function AlbumDetailPage({
  params,
}: {
  params: Promise<SlugParams>;
}) {
  const router = useRouter();
  const [albumId, setAlbumId] = useState<number | null>(null);

  const resolvedParams = use(params) as SlugParams;

  useEffect(() => {
    if (resolvedParams.slug && resolvedParams.slug.length > 0) {
      const slugParts = resolvedParams.slug[0].split("-");
      const id = parseInt(slugParts[0], 10);
      if (!isNaN(id)) {
        setAlbumId(id);
      }
    }
  }, [resolvedParams.slug]);

  // Fetch album details
  const { loading, error, data } = useQuery(GET_ALBUM, {
    variables: { id: albumId },
    skip: albumId === null,
  });

  const handleBack = () => {
    router.push("/");
  };

  if (!albumId) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography>Invalid album ID</Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Albums
          </Button>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography color="error">
            Error loading album: {error.message}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Albums
          </Button>
        </Box>
      </Container>
    );
  }

  const album = data?.album;

  if (!album) {
    return (
      <Container>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography>Album not found</Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Albums
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ position: "relative", mb: { xs: 2, md: 0 } }}>
                <CardMedia
                  component="img"
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                  image={album.largeAlbumCover || DEFAULT_ALBUM_COVER}
                  alt={`${album.title} album cover`}
                />
              </Box>
              <Box>
                <Button
                  color="secondary"
                  variant="contained"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBack}
                  sx={{ mt: 2 }}
                >
                  Back
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography
                variant="h4"
                component="h1"
                sx={{ mb: 2, color: "primary.main" }}
              >
                {album.title}
              </Typography>

              <Typography variant="h5" sx={{ mb: 3 }}>
                {album.artist}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Chip
                  label={album.genre}
                  size="medium"
                  sx={{
                    bgcolor: "secondary.light",
                    color: "secondary.dark",
                    fontWeight: 500,
                    px: 1,
                  }}
                />

                <Chip
                  label={album.releaseYear}
                  size="medium"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Box>

              {album.tracks && album.tracks.length > 0 && (
                <TrackList tracks={album.tracks} />
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}
