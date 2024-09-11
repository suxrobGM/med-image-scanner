import {Typography} from "@mui/material";
import {JoinOrganizationForm} from "./components";

interface JoinOrganizationPageProps {
  searchParams?: {
    token?: string;
  };
}

export default function JoinOrganizationPage({searchParams}: JoinOrganizationPageProps) {
  if (searchParams?.token == null) {
    return (
      <Typography variant="h4" color="red">
        Invalid token
      </Typography>
    );
  }

  return <JoinOrganizationForm token={searchParams.token} />;
}
