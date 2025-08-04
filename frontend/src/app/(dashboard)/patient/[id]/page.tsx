import {Box, Stack, Typography} from "@mui/material";
import {amber} from "@mui/material/colors";
import {getTranslations} from "next-intl/server";
import {auth} from "@/auth";
import {Banner, MessageBanner} from "@/components";
import {PersonShieldIcon} from "@/components/icons";
import {ApiService} from "@/core/services";
import {DateUtils, UserUtils} from "@/core/utils";
import {PatientTabContent} from "./components";

interface PatientPageProps {
  params: {
    id: string;
  };
}

export default async function PatientPage({params}: PatientPageProps) {
  const session = await auth();
  const t = await getTranslations();

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

  const result = await ApiService.ins.getPatient({
    patientId: params.id,
    organization: organizationName,
  });

  if (!result.success) {
    console.error(result.error);
    return <MessageBanner message={"Failed to fetch patient data"} />;
  }

  const textStyle = {
    color: "white",
    fontSize: 18,
    fontWeight: 400,
  };

  const patient = result.data!;

  return (
    <Box>
      <Banner>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PersonShieldIcon
            sx={{
              width: 30,
              height: 30,
              fill: amber[800],
            }}
          />
          <Typography sx={textStyle}>MRN #{patient.mrn}</Typography>
        </Stack>
        <Typography variant="h4" sx={{color: "white", fontSize: 45, fontWeight: 600, mb: 1}}>
          {patient.name}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Typography sx={textStyle}>{UserUtils.getGender(patient.gender, t)}</Typography>
          <Typography sx={textStyle}>{patient.birthDate}</Typography>
          <Typography sx={textStyle}>
            {DateUtils.getAge(patient.birthDate)} {t("dashboard.yearsOld")}
          </Typography>
        </Stack>
      </Banner>

      <PatientTabContent patientId={params.id} organization={organizationName} />
    </Box>
  );
}
