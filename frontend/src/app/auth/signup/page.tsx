import {Box, Button, Typography} from "@mui/material";

export default function GetStartedPage() {
  return (
    <>
      <Box mb={4}>
        <Typography variant="h3" sx={{fontSize: 42}}>
          Sign up for free
        </Typography>
      </Box>
      <Box width={400}>
        <Button
          href="/auth/signup/account-type"
          fullWidth
          size="large"
          variant="contained"
          color="primary"
        >
          Get Started
        </Button>
      </Box>
    </>
  );
}
