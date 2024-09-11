import {Container, Stack, Typography} from "@mui/material";
import {AddOrganizationForm} from "../components";

export default function AddOrganizationPage() {
  return (
    <Container maxWidth="md">
      <Stack direction="column" gap={2} p={3}>
        <Typography variant="h4" textAlign="center">Create Organization</Typography>
        <AddOrganizationForm />
      </Stack>
    </Container>
  );
}
