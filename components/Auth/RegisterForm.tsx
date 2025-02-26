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
import { REGISTER_USER, GET_CURRENT_USER } from "@/app/graphql/mutations";

interface RegisterFormProps {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const apolloClient = useApolloClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    async onCompleted(data) {
      // Store the token in localStorage
      localStorage.setItem("auth_token", data.register.token);

      // Also store basic user info
      const userInfo = {
        email: data.register.user.email,
        name: data.register.user.name,
      };
      localStorage.setItem("user_info", JSON.stringify(userInfo));

      try {
        // Manually update Apollo Client cache
        await apolloClient.writeQuery({
          query: GET_CURRENT_USER,
          data: {
            me: {
              ...data.register.user,
              likedAlbums: data.register.user.likedAlbums || [],
              __typename: "User",
            },
          },
        });

        // Trigger a refetch of the current user
        await apolloClient.refetchQueries({
          include: [GET_CURRENT_USER],
        });

        // Dispatch storage event to trigger updates in other components
        window.dispatchEvent(new Event("storage"));

        // Call the success callback
        onSuccess();
      } catch (error) {
        console.error("Error updating cache after registration", error);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || "An error occurred during registration");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Simple validation
    if (!email || !password) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    try {
      await registerUser({
        variables: {
          input: {
            name,
            email,
            password,
          },
        },
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        fullWidth
        id="name"
        label="Full Name"
        name="name"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        sx={{ mb: 2 }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
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
        sx={{ mb: 2 }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
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
            Creating Account
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                right: 16,
              }}
            />
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </Box>
  );
}
