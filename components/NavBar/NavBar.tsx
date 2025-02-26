"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  SvgIcon,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AuthModal } from "../Auth";
import { useRouter } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";
import { useQuery, useApolloClient } from "@apollo/client";
import { GET_CURRENT_USER } from "@/app/graphql/mutations";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const apolloClient = useApolloClient();
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    email?: string;
    name?: string;
    id?: number;
  } | null>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  // Current user query, now using the isLoggedIn flag from context hopefully this fixes like bug
  const { refetch } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
    skip: !isLoggedIn,
    onCompleted: (data) => {
      if (data?.me) {
        setUserInfo({
          email: data.me.email,
          name: data.me.name,
          id: data.me.id,
        });
      }
    },
    onError: (error) => {
      console.error("Error fetching current user:", error);
      handleLogout();
    },
  });

  const handleLoginClick = () => {
    setAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
    // Optionally refetch user data after closing the modal if logged in
    if (isLoggedIn) {
      refetch();
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");

      // Reset Apollo Client store
      await apolloClient.resetStore();

      // Update auth context and local state
      setIsLoggedIn(false);
      setUserInfo(null);
      handleUserMenuClose();

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get user initials for avatar need to move to utils folder to do
  const getUserInitials = () => {
    if (userInfo?.name) {
      return userInfo.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return userInfo?.email?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.main", py: 2 }}>
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Link href="/" passHref>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
                color: "black",
                backgroundColor: "white",
                borderRadius: 2,
              }}
            >
              <SvgIcon
                component="object"
                data={"/logo.svg"}
                inheritViewBox
                sx={{
                  fontSize: 80,
                  mr: 2,
                  "& object": {
                    height: "100%",
                  },
                }}
              />
              <Typography color="secondary.dark" variant="h6" component="div">
                Music Finder App
              </Typography>
            </Box>
          </Link>

          {isLoggedIn ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "secondary.main",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 0 8px rgba(0,0,0,0.3)",
                  },
                }}
                onClick={handleUserMenuOpen}
              >
                {getUserInitials()}
              </Avatar>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  sx: { width: 200, mt: 1 },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {userInfo && (
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" noWrap>
                      {userInfo.name || userInfo.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {userInfo.email}
                    </Typography>
                  </Box>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              size="large"
              variant="contained"
              color="secondary"
              onClick={handleLoginClick}
            >
              Log In
            </Button>
          )}
        </Box>
      </Toolbar>
      <AuthModal open={authModalOpen} onClose={handleAuthModalClose} />
    </AppBar>
  );
};

export default Navbar;
