"use client";
import {useTranslations} from "next-intl";
import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import {PatientDto} from "@/core/models";
import {DateUtils, UserUtils} from "@/core/utils";

interface PatientCardProps {
  patient: PatientDto;
}

export default function PatientCard({patient}: PatientCardProps) {
  const t = useTranslations();

  return (
    <Card variant="outlined" sx={{maxWidth: "250px"}}>
      <CardContent>
        <Typography variant="h5" component="div">
          {patient.name}
        </Typography>
        <Typography sx={{mb: 1.5}} color="text.secondary">
          MRN: {patient.mrn}
        </Typography>
        <Typography sx={{mb: 1.5}} color="text.secondary">
          {t("common.age")}: {DateUtils.getAge(patient.birthDate)}
        </Typography>
        <Typography variant="body2">
          {t("common.gender.value")}: {UserUtils.getGender(patient.gender, t)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button href={`/patient/${patient.id}`} variant="contained">
          {t("dashboard.view")}
        </Button>
      </CardActions>
    </Card>
  );
}
