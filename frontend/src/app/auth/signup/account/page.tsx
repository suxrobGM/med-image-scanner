import {Typography} from "@mui/material";
import {AccountForm} from "./components";

interface ConfigureAccountPageProps {
  searchParams?: {
    token?: string;
  };
}

export default function ConfigureAccountPage({searchParams}: ConfigureAccountPageProps) {
  if (searchParams?.token == null) {
    return (
      <Typography variant="h4" color="red">
        Invalid token
      </Typography>
    );
  }

  return <AccountForm token={searchParams.token} />;
}
