"use client";

import {
  List,
  ListItem,
  Typography,
  Box,
  Divider,
  ListItemButton,
} from "@mui/material";
import { Track } from "@/app/types";

interface TrackListProps {
  tracks: Track[];
}

// Format duration from seconds to mm:ss should move to utils folder to do later
function formatDuration(seconds: number | null): string {
  if (!seconds) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function TrackList({ tracks }: TrackListProps) {
  if (!tracks || tracks.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No tracks available
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tracks
      </Typography>
      <List disablePadding>
        {tracks.map((track, index) => (
          <Box key={track.id || index}>
            {index > 0 && <Divider sx={{ my: 1 }} />}
            <ListItem
              disablePadding
              component={track.url ? "a" : "div"}
              href={track.url || undefined}
              target={track.url ? "_blank" : undefined}
              sx={{
                textDecoration: "none",
                color: "inherit",
                p: 1,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.05)",
                },
              }}
            >
              <ListItemButton disableRipple>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minWidth: 24 }}
                    >
                      {index + 1}.
                    </Typography>
                    <Box>
                      <Typography variant="body1">{track.name}</Typography>
                      {track.artist && track.artist !== track.name && (
                        <Typography variant="body2" color="text.secondary">
                          {track.artist}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatDuration(track.duration)}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          </Box>
        ))}
      </List>
    </Box>
  );
}
