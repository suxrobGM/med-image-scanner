import {Button, Container, Stack, Typography} from "@mui/material";
import {ApiService} from "@/core/services";
import {EditOrganizationForm} from "../components";

interface EditOrganizationPageProps {
  params: {
    id: string;
  };
}

export default async function EditOrganiztionPage({params}: EditOrganizationPageProps) {
  const result = await ApiService.ins.getOrganization(params.id);

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
          Edit Organization
        </Typography>

        <EditOrganizationForm organization={organization} />

        <Stack direction="row" gap={2}>
          <Button href="/admin/organizations" variant="contained" color="primary">
            Back
          </Button>
          <Button
            href={`/admin/organizations/${organization.id}/users`}
            variant="contained"
            color="primary"
          >
            Manage Users
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
