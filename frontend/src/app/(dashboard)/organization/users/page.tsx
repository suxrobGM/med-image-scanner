import {Container, Stack, Typography} from "@mui/material";
import {auth} from "@/auth";
import {UsersGrid} from "@/app/(dashboard)/admin/users/components";
import {InviteToOrgDialog} from "./components";

export default async function OrganizationUsersPage() {
  const session = await auth();

  if (!session) {
    return <Typography variant="h4">You need to be logged in to view this page</Typography>;
  }

  const organizationName = session.user?.organization;

  if (!organizationName) {
    return <Typography variant="h4">You need to be a member of an organization to view this page</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Stack direction="column" gap={2} p={3}>
        <Typography variant="h4" textAlign="center">
          Members of Organization '{organizationName}'
        </Typography>

        <InviteToOrgDialog organization={organizationName} />
        <UsersGrid organization={{name: organizationName}} showOnlyOrgUsers />
      </Stack>
    </Container>
  );
}
