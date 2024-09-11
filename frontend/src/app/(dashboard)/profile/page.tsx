import {auth} from "@/auth";
import {Typography} from "@mui/material";
import {ApiService} from "@/core/services";
import {UserProfilePanel} from "./components";

export default async function UserProfilePage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return <Typography variant="h4">You need to be logged in to view this page</Typography>;
  }

  const result = await ApiService.ins.getUser(session.user.id);

  if (!result.success || !result.data) {
    return <Typography variant="h4">Failed to load user profile</Typography>;
  }

  return <UserProfilePanel user={result.data} />;
}
