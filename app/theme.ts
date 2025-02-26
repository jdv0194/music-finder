import { createTheme, ThemeOptions } from "@mui/material/styles";

const leafGreen = {
  light: "#9aca9a",
  main: "#8fbc8f",
  dark: "#689f68",
  contrastText: "#ffffff",
};

const barkBrown = {
  light: "#e5cba3",
  main: "#d2b48c",
  dark: "#b08d5f",
  contrastText: "#ffffff",
};

export const themeOptions: ThemeOptions = {
  palette: {
    primary: leafGreen,
    secondary: barkBrown,
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
  },
};

// Create the theme
const theme = createTheme(themeOptions);

export default theme;
