"use client";

import { useQuery } from "@apollo/client";
import { Box, Typography, Grid, CircularProgress, Button } from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import AlbumsFilter from "../AlbumsFilter";
import AlbumCard from "../AlbumCard";
import { GET_ALBUMS } from "@/app/graphql";
import { Album, FilterValues } from "@/app/types";
import { useAuth } from "@/context/AuthContext";
import AddAlbumModal from "@/components/AddAlbum";

export default function AlbumsList() {
  // State for filter values
  const [filterValues, setFilterValues] = useState<FilterValues>({
    genre: "",
    artist: "",
    year: "",
  });

  const [addModalOpen, setAddModalOpen] = useState(false);

  // Build the filter object for GraphQL
  const filter = useMemo(() => {
    const result: Record<string, any> = {};
    if (filterValues.genre) result.genre = filterValues.genre;
    if (filterValues.artist) result.artist = filterValues.artist;
    if (filterValues.year !== "")
      result.releaseYear = Number(filterValues.year);
    return result;
  }, [filterValues]);

  // Get the current auth state from context
  const { isLoggedIn } = useAuth();

  const { loading, error, data, refetch } = useQuery(GET_ALBUMS, {
    variables: { filter, isLoggedIn },
    fetchPolicy: "network-only",
  });

  // Refetch albums whenever the authentication state changes
  useEffect(() => {
    refetch();
  }, [isLoggedIn, refetch]);

  // Get unique genres for the filter dropdown
  const genres = useMemo(() => {
    if (!data?.albums) return [];
    return [...new Set(data.albums.map((album: Album) => album.genre))];
  }, [data]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilterValues(newFilters);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">
          Error loading albums: {error.message}
        </Typography>
      </Box>
    );
  }

  const albums: Album[] = data?.albums || [];

  return (
    <Box sx={{ py: 4 }}>
      <AddAlbumModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          setAddModalOpen(false);
          refetch();
        }}
      />
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 4, color: "primary.main" }}
      >
        Music Albums
      </Typography>

      <AlbumsFilter
        genres={genres}
        onChange={handleFilterChange}
        initialValues={filterValues}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setAddModalOpen(true)}
        sx={{ mb: 4 }}
      >
        Add Album
      </Button>
      {albums.length === 0 ? (
        <Typography>No albums found. Try adjusting your filters.</Typography>
      ) : (
        <Grid container spacing={3}>
          {albums.map((album) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={album.id}>
              <AlbumCard album={album} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
