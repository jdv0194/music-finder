import { Box, Container, AppBar, Toolbar, Typography } from "@mui/material";
import { AlbumsList } from "@/components/Albums";

export default function HomePage() {
  return (
    <>
      <Container maxWidth="xl">
        <Box sx={{ mt: 4, mb: 8 }}>
          <AlbumsList />
        </Box>
      </Container>
    </>
  );
}
