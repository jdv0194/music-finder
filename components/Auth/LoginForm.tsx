"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN_USER, GET_CURRENT_USER } from "@/app/graphql/mutations";
import { useAuth } from "@/context/AuthContext"; // Import the hook

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const apolloClient = useApolloClient();
  const { setIsLoggedIn } = useAuth(); // Get the setter from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    async onCompleted(data) {
      // Store the token in localStorage
      localStorage.setItem("auth_token", data.login.token);

      // Store basic user info
      const userInfo = {
        email: data.login.user.email,
        name: data.login.user.name,
      };
      localStorage.setItem("user_info", JSON.stringify(userInfo));

      // Update AuthContext state manually
      setIsLoggedIn(true);

      try {
        // Manually update Apollo Client cache
        await apolloClient.writeQuery({
          query: GET_CURRENT_USER,
          data: {
            me: {
              ...data.login.user,
              likedAlbums: data.login.user.likedAlbums || [],
              __typename: "User",
            },
          },
        });

        // Trigger a refetch of the current user hopefully fixes liek bug
        await apolloClient.refetchQueries({
          include: [GET_CURRENT_USER],
        });

        // Dispatch storage event hacky test for liked albums
        window.dispatchEvent(new Event("storage"));

        // Call success callback
        onSuccess();
      } catch (error) {
        console.error("Error updating cache after login", error);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || "An error occurred during login");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    try {
      await loginUser({
        variables: {
          input: { email, password },
        },
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleTogglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ py: 1.5, position: "relative" }}
      >
        {loading ? (
          <>
            Signing In
            <CircularProgress
              size={24}
              sx={{ position: "absolute", right: 16 }}
            />
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </Box>
  );
}
