"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { ADD_ALBUM } from "@/app/graphql/mutations";
import { GET_ALBUMS } from "@/app/graphql";
import { getAlbumInfo } from "@/lib/lastfm-api";

interface AddAlbumModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAlbumModal: React.FC<AddAlbumModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [addAlbumMutation] = useMutation(ADD_ALBUM, {
    onCompleted: () => {
      setLoading(false);
      onSuccess();
    },
    onError: (err) => {
      setError(err.message);
      setLoading(false);
    },
  });

  const handleSubmit = async () => {
    setError(null);
    if (!artist || !album) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);
    try {
      const albumInfo = await getAlbumInfo(artist, album);
      if (!albumInfo) {
        setError("Album not found on Last.fm.");
        setLoading(false);
        return;
      }
      const input = {
        title: album,
        artist,
        albumCover: albumInfo.albumCover,
        largeAlbumCover: albumInfo.largeAlbumCover,
        albumUrl: albumInfo.url,
        tracks: albumInfo.tracks?.map((track) => ({
          name: track.name,
          artist: track.artist,
          duration: track.duration,
          url: track.url,
        })),
      };
      await addAlbumMutation({
        variables: { input },
        refetchQueries: [{ query: GET_ALBUMS }],
        awaitRefetchQueries: true,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setArtist("");
    setAlbum("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Album</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Artist Name"
          fullWidth
          variant="outlined"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Album Name"
          fullWidth
          variant="outlined"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Add Album"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAlbumModal;
