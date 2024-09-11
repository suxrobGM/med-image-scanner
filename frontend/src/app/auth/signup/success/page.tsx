import {Box, Typography} from "@mui/material";
import {LetsGoButton} from "./components";

interface SignUpSuccessPageProps {
  searchParams?: {
    name?: string;
  }
}

export default function SignUpSuccessPage({searchParams}: SignUpSuccessPageProps) {
  return (
    <Box>
      <Box>
        <Typography variant="h3" sx={{fontSize: 42, mb: 2}}>
          Congratulations!
        </Typography>
        <Typography variant="body1" sx={{fontSize: 20}}>
          Welcome aboard, {searchParams?.name ?? "User"}
        </Typography>
      </Box>
      <Box mt={4}>
        <LetsGoButton />
      </Box>
    </Box>
  );
}
