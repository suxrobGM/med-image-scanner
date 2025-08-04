import {Container, Stack, Typography} from "@mui/material";
import {EditOrganizationForm} from "@/app/(dashboard)/admin/organizations/components";
import {auth} from "@/auth";
import {ApiService} from "@/core/services";

export default async function EditOrganizationPage() {
  const session = await auth();

  if (!session) {
    return <Typography variant="h4">You need to be logged in to view this page</Typography>;
  }

  const organizationName = session.user?.organization;

  if (!organizationName) {
    return (
      <Typography variant="h4">
        You need to be a member of an organization to view this page
      </Typography>
    );
  }

  const result = await ApiService.ins.getOrganization(organizationName);

  if (!result.success) {
    return (
      <Typography variant="h5" color="error">
        {result.error}
      </Typography>
    );
  }

  const organization = result.data!;

  return (
    <Container maxWidth="md">
      <Stack direction="column" gap={2} p={3}>
        <Typography variant="h4" textAlign="center">
          Edit Organization '{organization.name}'
        </Typography>
        <EditOrganizationForm organization={organization} />
      </Stack>
    </Container>
  );
}
