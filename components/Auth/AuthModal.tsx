"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: number;
}

export default function AuthModal({
  open,
  onClose,
  initialTab = 0,
}: AuthModalProps) {
  const [tabValue, setTabValue] = useState(initialTab);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAuthSuccess = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h6" component="div">
          {tabValue === 0 ? "Sign In" : "Create Account"}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="authentication tabs"
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "primary.main",
              height: 3,
            },
            "& .Mui-selected": {
              color: "primary.main",
              fontWeight: "bold",
            },
          }}
        >
          <Tab label="Login" id="auth-tab-0" aria-controls="auth-tabpanel-0" />
          <Tab
            label="Register"
            id="auth-tab-1"
            aria-controls="auth-tabpanel-1"
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <TabPanel value={tabValue} index={0}>
          <LoginForm onSuccess={handleAuthSuccess} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <RegisterForm onSuccess={handleAuthSuccess} />
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
