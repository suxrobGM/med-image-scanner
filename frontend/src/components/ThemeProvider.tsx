"use client";

import {ReactNode, createContext, useContext, useState} from "react";
import {ThemeProvider as MuiThemeProvider} from "@mui/material/styles";
import {darkTheme, lightTheme} from "@/themes";

interface ThemeContextType {
  currentTheme: "light" | "dark";
  setCurrentTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "light",
  setCurrentTheme: (theme: "light" | "dark") => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({children}: {children: ReactNode}) {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{currentTheme, setCurrentTheme}}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
