"use client";
import {useTranslations} from "next-intl";
import {Card, Box, Stack, Typography, Divider, Button} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import {StatIcon, ModalityIcon} from "@/components/icons";
import {ReportDto} from "@/core/models";
import {DateUtils} from "@/core/utils";

interface ReportCardProps {
  report: ReportDto;
}

export function ReportCard({report}: ReportCardProps) {
  const t = useTranslations();

  return (
    <Card sx={{maxWidth: "400px"}}>
      <Box p={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
          <Typography variant="h6">
            {report.patient.name}
          </Typography>
          <Typography variant="body1">MRN {report.patient.mrn}</Typography>
        </Stack>
        <Divider />
        <Stack direction="row" spacing={6} mt={2} mb={2}>
          <Box>
            <Typography sx={{color: "grey.600"}}>{t("dashboard.priority")}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <StatIcon color="error" />
              <Typography color="error" fontWeight={600}>
                {t("dashboard.stat")}
              </Typography>
            </Stack>
          </Box>
          <Box>
            <Typography sx={{color: "grey.600"}}>{t("dashboard.modality")}</Typography>

            <ModalityIcon color="disabled" />
            <Typography color="disabled" fontWeight={600}>
              {report.modality}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={4} mt={2}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <TodayOutlinedIcon />
            <Typography variant="body2">{DateUtils.formatDate(report.createdAt)}</Typography>
          </Stack>
          <Button href={`/report/${report.id}`} variant="outlined" endIcon={<VisibilityOutlinedIcon />}>
            {t("dashboard.view")}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
