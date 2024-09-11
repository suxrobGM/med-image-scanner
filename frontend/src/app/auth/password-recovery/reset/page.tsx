import {Typography} from "@mui/material";
import {ResetPasswordForm} from "./components";

interface SetPasswordPageProps {
  searchParams?: {
    token?: string;
  };
}

export default function SetPasswordPage({searchParams}: SetPasswordPageProps) {
  if (searchParams?.token == null) {
    return (
      <Typography variant="h4" color="red">
        Invalid token
      </Typography>
    );
  }

  return <ResetPasswordForm token={searchParams.token} />;
}
