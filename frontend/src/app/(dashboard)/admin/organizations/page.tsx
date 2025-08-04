import {Box, Button, Stack, Typography} from "@mui/material";
import {OrganizationsGrid} from "./components";

export default function OrganizationsPage() {
  return (
    <Stack gap={3} p={2}>
      <Typography variant="h3">Organizations</Typography>
      <Button
        href="/admin/organizations/add"
        variant="contained"
        color="primary"
        sx={{alignSelf: "flex-start"}}
      >
        Add Organization
      </Button>
      <Box height="600px">
        <OrganizationsGrid />
      </Box>
    </Stack>
  );
}
