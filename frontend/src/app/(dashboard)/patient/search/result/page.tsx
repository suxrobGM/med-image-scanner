import {Box, Grid, Stack, Typography} from "@mui/material";
import {LinkPagination} from "@/components";
import {PatientDto} from "@/core/models";
import {ApiService} from "@/core/services";
import {PatientCard} from "./components";

interface SearchPatientResultProps {
  searchParams: Record<string, string>;
}

export default async function PatientSearchResultPage(props: SearchPatientResultProps) {
  const search = props.searchParams["q"] ?? "";
  const page = Number(props.searchParams["page"] ?? 1);
  const pageSize = Number(props.searchParams["pageSize"] ?? 10);
  const result = await ApiService.ins.getPatients({search, page, pageSize});

  if (!result.data || result.data.length === 0) {
    return <Typography variant="h5">No patients found for "{search}"</Typography>;
  }

  const patients = result.data!;

  return (
    <Stack p={2}>
      <Typography variant="h5">Search results for "{search}"</Typography>
      <Typography variant="subtitle1">Found {patients.length} patients</Typography>

      <Box mt={2}>
        <Grid container spacing={2}>
          {patients.map((patient: PatientDto) => (
            <Grid item key={patient.id} xs={12} sm={6} md={4} lg={2}>
              <PatientCard patient={patient} />
            </Grid>
          ))}
        </Grid>

        <LinkPagination
          href="/patient/search/result"
          pagesCount={result.pagesCount}
          page={page}
          urlSearchParams={{q: search, pageSize}}
        />
      </Box>
    </Stack>
  );
}
