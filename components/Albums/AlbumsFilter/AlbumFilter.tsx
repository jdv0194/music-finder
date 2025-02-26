"use client";

import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { FilterValues } from "@/app/types";

interface AlbumsFilterProps {
  genres: string[];
  onChange: (filters: FilterValues) => void;
  initialValues?: FilterValues;
}

export default function AlbumsFilter({
  genres,
  onChange,
  initialValues,
}: AlbumsFilterProps) {
  const [genreFilter, setGenreFilter] = useState(initialValues?.genre || "");
  const [artistFilter, setArtistFilter] = useState(initialValues?.artist || "");
  const [yearFilter, setYearFilter] = useState<number | "">(
    initialValues?.year || ""
  );

  // Flag to prevent useEffect from running on initial mount
  const isInitialMount = useRef(true);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced onChange handler
  const debouncedOnChange = (filters: FilterValues) => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      onChange(filters);
    }, 1000); // 1 second delay maybe half a second idk will come back to this
  };

  const handleImmediateChange = (filters: FilterValues) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    onChange(filters);
  };

  const handleGenreChange = (event: SelectChangeEvent) => {
    const newGenre = event.target.value;
    setGenreFilter(newGenre);

    handleImmediateChange({
      genre: newGenre,
      artist: artistFilter,
      year: yearFilter,
    });
  };

  const handleArtistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newArtist = e.target.value;
    setArtistFilter(newArtist);

    // Debounce for text input
    debouncedOnChange({
      genre: genreFilter,
      artist: newArtist,
      year: yearFilter,
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newYear = value === "" ? "" : Number(value);
    setYearFilter(newYear);

    // Debounce for text input
    debouncedOnChange({
      genre: genreFilter,
      artist: artistFilter,
      year: newYear,
    });
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Trigger onChange with initial values on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      // Only trigger if there are initial values
      if (
        initialValues?.genre ||
        initialValues?.artist ||
        initialValues?.year
      ) {
        onChange({
          genre: genreFilter,
          artist: artistFilter,
          year: yearFilter,
        });
      }
    }
  }, [initialValues, genreFilter, artistFilter, yearFilter, onChange]);

  return (
    <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel id="genre-filter-label">Genre</InputLabel>
        <Select
          labelId="genre-filter-label"
          value={genreFilter}
          label="Genre"
          onChange={handleGenreChange}
          sx={{ bgcolor: "background.paper" }}
        >
          <MenuItem value="">All Genres</MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre} value={genre}>
              {genre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Artist"
        value={artistFilter}
        onChange={handleArtistChange}
        sx={{ minWidth: 150, bgcolor: "background.paper" }}
      />

      <TextField
        label="Year"
        value={yearFilter}
        onChange={handleYearChange}
        type="number"
        sx={{ minWidth: 100, bgcolor: "background.paper" }}
      />
    </Box>
  );
}
