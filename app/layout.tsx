"use client";

import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import ApolloProvider from "@/components/ApolloProvider";
import Navbar from "@/components/NavBar";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <html lang="en">
          <CssBaseline />
          <body>
            <ApolloProvider>
              <AuthProvider>
                <Navbar />
                {children}
              </AuthProvider>
            </ApolloProvider>
          </body>
        </html>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
