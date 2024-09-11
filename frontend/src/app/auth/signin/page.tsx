import {Box} from "@mui/material";
import {LoginForm} from "./components";

export default async function SignInPage() {
  return (
    <Box maxWidth={400}>
      <LoginForm />
    </Box>
  );
}
