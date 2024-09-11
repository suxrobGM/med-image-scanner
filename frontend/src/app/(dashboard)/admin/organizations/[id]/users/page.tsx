import {Container, Stack, Typography} from "@mui/material";
import {UsersGrid} from "@/app/(dashboard)/admin/users/components";

interface OrganizationUsersPageProps {
  params: {
    id: string;
  };
}

export default function OrganizationUsersPage({params}: OrganizationUsersPageProps) {
  return (
    <Container maxWidth="md">
      <Stack direction="column" gap={2} p={3}>
        <Typography variant="h4" textAlign="center">Organization Users</Typography>
        <UsersGrid organization={{id: params.id}} showOnlyOrgUsers />
      </Stack>
    </Container>
  );
}
