"use client";

import {red} from "@mui/material/colors";
import {ThemeOptions, createTheme} from "@mui/material/styles";
import {LinkBehaviour} from "@/components";

declare module "@mui/material/styles" {
  interface Palette {
    TealText: string;
  }

  interface PaletteOptions {
    TealText?: string;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsColorOverrides {
    TealText: true;
  }
}

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Noto Sans", sans-serif;',
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehaviour,
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehaviour,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
};

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    info: {
      main: "#02F2DA",
    },
    error: {
      main: red.A400,
    },
    TealText: "#21FDE7",
  },
});

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
  },
});
