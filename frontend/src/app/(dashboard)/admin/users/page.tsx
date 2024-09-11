import {Stack, Typography} from "@mui/material";
import {InviteUserDialog, UsersGrid} from "./components";

export default function UsersPage() {
  return (
    <Stack gap={3} p={2}>
      <Typography variant="h3">Users</Typography>
      <InviteUserDialog />
      <UsersGrid />
    </Stack>
  );
}
