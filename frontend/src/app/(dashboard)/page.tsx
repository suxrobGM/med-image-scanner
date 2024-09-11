import {getTranslations} from "next-intl/server";
import {Box, Grid, Typography} from "@mui/material";
import {auth} from "@/auth";
import {BgCircle} from "@/components";
import {ApiService} from "@/core/services";
import {ReportDto} from "@/core/models";
import {ReportCard} from "./components";


function getDailyGreeting(t: (key: string) => string): string {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return t("common.greetings.morning");
  }
  else if (currentHour < 18) {
    return t("common.greetings.afternoon");
  }
  else {
    return t("common.greetings.evening");
  }
}

export default async function DashboardPage() {
  const t = await getTranslations();
  const session = await auth();
  let userBookmarkedReports: ReportDto[] = [];

  if (session?.user?.id) {
    const result = await ApiService.ins.getUserBookmarkedReports(session.user.id);

    if (result.success && result.data) {
      userBookmarkedReports = result.data;
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: {
          xs: "20vh",
          sm: "35vh",
          md: "35vh",
          lg: "30vh",
        },
        background: "linear-gradient(1deg, #FD5645 -13.38%, #710A42 17.14%, #041551 122.48%)",
      }}
    >
      <BgCircle
        sx={{
          position: "absolute",
          top: "1",
          right: "0",
        }}
      />
      <Box p={4}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontSize: 45,
              fontWeight: 600,
              mb: 1,
            }}
          >
            {getDailyGreeting(t)}, {session?.user?.name}
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontSize: 20,
              fontWeight: 400,
              mb: 3,
            }}
          >
            {t("dashboard.welcomeBack")}
          </Typography>
        </Box>
        <Box>
          <Box mt={4}>
            <Typography variant="h5" sx={{mb: 3, fontWeight: 600}}>
              Saved Reports
            </Typography>
          </Box>
          <Box mt={4}>
            {userBookmarkedReports.length === 0 && (
              <Typography variant="body1" color="textSecondary">
                No saved reports yet
              </Typography>
            )}

            <Grid container spacing={4}>
              {userBookmarkedReports.map((report: ReportDto) => (
                <Grid item xs={12} sm={4} md={3}>
                  <ReportCard key={report.id} report={report} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
