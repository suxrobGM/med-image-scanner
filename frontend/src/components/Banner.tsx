import {ReactNode} from "react";
import {Box} from "@mui/material";
import {BgPattern} from "./BgPattern";

/**
 * Background like component for displaying page header.
 * @param children Children components.
 */
export function Banner({children}: {children: ReactNode}) {
  return (
    <Box
      sx={{
        position: "relative",
        padding: 3,
        background:
          "linear-gradient(270deg, rgba(16, 29, 70, 0.00) 3.37%, rgba(0, 27, 111, 0.87) 103.52%), linear-gradient(85deg, #FB37A3 -2.11%, #FF5C00 133.56%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#D0D9FE",
          opacity: 0.1,
          zIndex: 1,
        }}
      ></Box>
      <BgPattern
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.1,
          zIndex: 2,
        }}
      />
      {children}
    </Box>
  );
}
