import {Box, Button, Divider, Grid, Stack, Typography} from "@mui/material";
import {auth} from "@/auth";
import {Banner, MessageBanner, OhifViewer} from "@/components";
import {PersonShieldIcon} from "@/components/icons";
import {UserDto} from "@/core/models";
import {ApiService} from "@/core/services";
import {DateUtils} from "@/core/utils";
import {BookmarkButton, ReportForm} from "./components";

interface ReportPageProps {
  params: {
    reportId: string;
  };
}

export default async function ReportPage({params}: ReportPageProps) {
  const result = await ApiService.ins.getReport(params.reportId);
  const session = await auth();
  const user = session?.user as UserDto;

  if (!user || !user?.id) {
    return (
      <Typography variant="h4" color="error">
        Unauthorized
      </Typography>
    );
  }

  if (!result.success || !result.data) {
    return <MessageBanner message={result.error!} />;
  }

  const report = result.data!;

  return (
    <Box>
      <Banner>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h4" color="InfoBackground">
            {report.patient.name}
          </Typography>
          <Typography
            variant="body2"
            color="InfoBackground"
            textAlign="center"
            display="flex"
            alignItems="center"
          >
            <PersonShieldIcon fill="#FFCB47" /> MRN #{report.patient.mrn}
          </Typography>
          <Typography variant="body2" color="InfoBackground">
            {report.patient.gender}
          </Typography>
          <Typography variant="body2" color="InfoBackground">
            {report.patient.birthDate}
          </Typography>
          <Typography variant="body2" color="InfoBackground">
            {DateUtils.getAge(report.patient.birthDate)} years old
          </Typography>
        </Stack>
      </Banner>
      <Grid
        container
        sx={{
          padding: 2,
          justifyContent: "center",
        }}
      >
        <Grid item xs={12} md={6}>
          <OhifViewer
            studyInstanceUid={report.studyInstanceUid}
            seriesInstanceUid={report.seriesInstanceUid}
            height="800px"
          />

          <Button
            href={`/viewer/${report.studyInstanceUid}?seriesId=${report.seriesInstanceUid}`}
            variant="contained"
            sx={{mt: 2}}
          >
            View in full screen
          </Button>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#1C2024",
            padding: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" gap={2}>
            <Typography variant="h4" color="TealText">
              Radiology Report
            </Typography>
            <BookmarkButton reportId={report.id} userId={user.id} />
          </Stack>

          <Typography variant="h5" my={4}>
            Patient Information
          </Typography>

          <Grid container>
            <Grid item xs={12} md={6}>
              <Stack direction="column" gap={1}>
                <Stack direction="row" gap={2}>
                  <Typography variant="body1" color="GrayText">
                    Patient Name
                  </Typography>
                  <Typography variant="body1">{report.patient.name}</Typography>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Typography variant="body1" color="GrayText">
                    Date of Birth
                  </Typography>
                  <Typography variant="body1">
                    {report.patient.birthDate} ({DateUtils.getAge(report.patient.birthDate)} years
                    old)
                  </Typography>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Typography variant="body1" color="GrayText">
                    Gender
                  </Typography>
                  <Typography variant="body1">{report.patient.gender}</Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack direction="column" gap={1}>
                <Stack direction="row" gap={2}>
                  <Typography variant="body1" color="GrayText">
                    MRN
                  </Typography>
                  <Typography variant="body1">{report.patient.mrn}</Typography>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Typography variant="body1" color="GrayText">
                    Study Date
                  </Typography>
                  <Typography variant="body1">{DateUtils.formatDate(report.createdAt)}</Typography>
                </Stack>
                {report.referringPhysician && (
                  <Stack direction="row" gap={2}>
                    <Typography variant="body1" color="GrayText">
                      Referring Physician
                    </Typography>
                    <Typography variant="body1">
                      {report.referringPhysician.firstName} {report.referringPhysician.lastName}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Grid>
          </Grid>

          <Box py={4}>
            <Divider orientation="horizontal" />
          </Box>

          <ReportForm report={report} user={user} />
        </Grid>
      </Grid>
    </Box>
  );
}
