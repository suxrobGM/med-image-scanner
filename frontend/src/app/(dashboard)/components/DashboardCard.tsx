"use client";
import {Card, Box, Button, ButtonProps, styled} from "@mui/material";
import {purple} from "@mui/material/colors";
import {ReactNode} from "react";

interface DashboardCardProps {
  children?: ReactNode;
  backgroundImage?: string;
}

export const DashboardCardColorButton = styled(Button)<ButtonProps>(({theme}) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundImage: "linear-gradient(90deg, rgba(255,87,0,0.75) 0%, rgba(231,105,249,0.7) 100%);",
  backdropFilter: "blur(10px)",
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: purple[700],
  },
}));

export function DashboardCard({children, backgroundImage}: DashboardCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        backgroundColor: "transparent",
        backgroundImage: backgroundImage || "linear-gradient(180deg, rgba(38,191,181,1) 0%, rgba(200,200,215,0.2) 75%)",
        backdropFilter: "blur(10px)", // apply blur effect
      }}
    >
      <Box p={2} height="100%">
        {children}
      </Box>
    </Card>
  );
}
