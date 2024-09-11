"use client";
import {ReactNode, useEffect} from "react";
import {usePathname} from "next/navigation";
import {Box, Grid, Stack} from "@mui/material";
import {useTheme} from "@/components";

interface SignUpLayoutProps {
  children?: ReactNode;
}

function SignUpSuccessLayout({children}: SignUpLayoutProps) {
  return (
    <Box
      display="flex"
      height="100vh"
      sx={{
        backgroundImage: 'url("/img/confetti.png")',
        backgroundRepeat: "round",
        backgroundSize: "cover"
      }}
    >
      <Box
        width="50%"
        padding={4}
        sx={{backgroundColor: "#FFFFFFEB"}}
      >
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default function AuthPagesLayout({children}: SignUpLayoutProps) {
  const pathname = usePathname();
  const {setCurrentTheme} = useTheme();

  useEffect(() => setCurrentTheme("light"), []);
  
  if (pathname === "/auth/signup/success") {
    return <SignUpSuccessLayout children={children} />;
  }

  return (
    <Box sx={{height: "100vh", overflowY: "hidden"}}>
      <Grid container spacing={2}>
        <Grid item xs={0} md={3}>
          <Box sx={{height: "100vh", overflowY: "hidden", bgcolor: "#01142D"}}>
            <Box display="flex" alignItems="center" justifyContent="center" mt={4}>
              Med Image Scanner
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          <Box
            sx={{
              height: "100vh",
              width: "100%",
              overflowY: "hidden",
              bgcolor: "background.default",
            }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Stack alignItems="center" justifyContent="center">
              {children}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
