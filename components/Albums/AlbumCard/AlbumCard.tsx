"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Album } from "@/app/types";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useMutation, useQuery } from "@apollo/client";
import {
  LIKE_ALBUM,
  UNLIKE_ALBUM,
  GET_CURRENT_USER,
} from "@/app/graphql/mutations";
import { AuthModal } from "@/components/Auth";
import { useAuth } from "@/context/AuthContext";

const DEFAULT_ALBUM_COVER = "/album-placeholder.jpg";

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [liked, setLiked] = useState(album.isLiked || false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // When auth state changes to logged out, update liked status to false.
  useEffect(() => {
    if (!isLoggedIn) {
      setLiked(false);
    }
  }, [isLoggedIn]);

  // Fetch current user data only when logged in
  const { data: userData } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (data?.me?.likedAlbums) {
        const isAlbumLiked = data.me.likedAlbums.some(
          (likedAlbum: Album) => likedAlbum.id === album.id
        );
        setLiked(isAlbumLiked);
      }
    },
    onError: (error) => {
      console.error("Error fetching current user:", error);
    },
    skip: !isLoggedIn,
  });

  const [likeAlbum, { loading: likeLoading }] = useMutation(LIKE_ALBUM, {
    update(cache, { data }) {
      try {
        const existingUser = cache.readQuery({ query: GET_CURRENT_USER });
        if (existingUser && data?.likeAlbum) {
          cache.writeQuery({
            query: GET_CURRENT_USER,
            data: {
              me: {
                ...existingUser.me,
                likedAlbums: [...existingUser.me.likedAlbums, data.likeAlbum],
              },
            },
          });
        }
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    },
    onCompleted: () => {
      setLiked(true);
    },
    onError: (error) => {
      if (error.message.includes("must be logged in")) {
        setAuthModalOpen(true);
      } else {
        console.error("Error liking album:", error.message);
      }
    },
  });

  const [unlikeAlbum, { loading: unlikeLoading }] = useMutation(UNLIKE_ALBUM, {
    update(cache, { data }) {
      try {
        const existingUser = cache.readQuery({ query: GET_CURRENT_USER });
        if (existingUser && data?.unlikeAlbum) {
          cache.writeQuery({
            query: GET_CURRENT_USER,
            data: {
              me: {
                ...existingUser.me,
                likedAlbums: existingUser.me.likedAlbums.filter(
                  (likedAlbum: Album) => likedAlbum.id !== data.unlikeAlbum.id
                ),
              },
            },
          });
        }
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    },
    onCompleted: () => {
      setLiked(false);
    },
    onError: (error) => {
      console.error("Error unliking album:", error.message);
    },
  });

  const handleCardClick = () => {
    router.push(
      `/album/${album.id}-${encodeURIComponent(
        album.title.toLowerCase().replace(/\s+/g, "-")
      )}`
    );
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }

    if (liked) {
      unlikeAlbum({
        variables: { albumId: album.id },
        optimisticResponse: {
          unlikeAlbum: {
            ...album,
            albumCover: album.albumCover || DEFAULT_ALBUM_COVER,
            largeAlbumCover: album.largeAlbumCover || DEFAULT_ALBUM_COVER,
            isLiked: false,
            __typename: "Album",
          },
        },
      });
    } else {
      likeAlbum({
        variables: { albumId: album.id },
        optimisticResponse: {
          likeAlbum: {
            ...album,
            albumCover: album.albumCover || DEFAULT_ALBUM_COVER,
            largeAlbumCover: album.largeAlbumCover || DEFAULT_ALBUM_COVER,
            isLiked: true,
            __typename: "Album",
          },
        },
      });
    }
  };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
  };

  const isLoading = likeLoading || unlikeLoading;

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer",
          position: "relative",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: 6,
          },
        }}
        onClick={handleCardClick}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(255,255,255,0.7)",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.9)",
            },
            zIndex: 1,
          }}
          onClick={handleLikeClick}
          disabled={isLoading}
        >
          {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>

        <CardMedia
          component="img"
          sx={{
            height: 250,
            objectFit: "cover",
            bgcolor: "rgba(0,0,0,0.05)",
          }}
          image={
            album.largeAlbumCover || album.albumCover || DEFAULT_ALBUM_COVER
          }
          alt={`${album.title} album cover`}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "primary.main", mb: 1 }}
          >
            {album.title}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {album.artist}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Chip
              label={album.genre}
              size="small"
              sx={{
                bgcolor: "secondary.light",
                color: "secondary.dark",
                fontWeight: 500,
              }}
            />

            <Typography variant="body2" color="text.secondary">
              {album.releaseYear}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <AuthModal open={authModalOpen} onClose={handleAuthModalClose} />
    </>
  );
}
