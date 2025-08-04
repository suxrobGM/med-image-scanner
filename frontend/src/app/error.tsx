"use client";

import {useEffect} from "react";
import {Box, Button, Typography} from "@mui/material";
import {useRouter} from "next/navigation";

interface ErrorProps {
  error: Error & {digest?: string};
  reset: () => void;
}

export default function Error({error, reset}: ErrorProps) {
  const router = useRouter();

  useEffect(() => console.error(error), [error]);

  const isTokenExpired = error.message.includes("Token has expired");

  const handleReload = () => {
    if (isTokenExpired) {
      router.push("/auth/signin");
      return;
    }

    reset();
  };

  return (
    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
      <Box sx={{textAlign: "center"}}>
        <Typography variant="h4">Oops! Something went wrong</Typography>
        <Typography variant="body1" mt={2}>
          An error occurred while rendering this page. Please try again later or contact support if
          the problem persists.
        </Typography>
        <Typography variant="body2" color="red">
          {error.message}
        </Typography>

        <Box mt={2}>
          <Button onClick={handleReload} variant="contained" color="primary">
            {isTokenExpired ? "Sign in" : "Reload"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
