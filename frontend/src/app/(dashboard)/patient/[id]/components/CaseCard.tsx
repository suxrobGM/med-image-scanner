"use client";
import {useTranslations} from "next-intl";
import {Box, Avatar, Button, Card, IconButton, Stack, Typography} from "@mui/material";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {StatusIcon} from "@/components/icons";
import {StringUtils, UserUtils} from "@/core/utils";

interface CaseDto {
  id: string;
  name: string;
  doctorFullName: string;
  doctorEmail: string;
  status: string;
  startDate: string;
}

interface CaseCardProps {
  patientCase: CaseDto;
}

export function CaseCard({patientCase}: CaseCardProps) {
  const t = useTranslations();
  // const reportViewUrl = `/dashboard/patient/${patientCase.patientId}/case`;


  return (
    <Card elevation={2} sx={{maxWidth: "400px"}}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="start"
        p={2}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box maxWidth={220}>
          <Typography variant="body1" sx={{fontWeight: 700, fontSize: 20}}>
            {patientCase.name}
          </Typography>
        </Box>
        <IconButton>
          <BookmarkAddedOutlinedIcon />
        </IconButton>
      </Stack>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" color="text.secondary" mb={1}>
          {t("components.caseCard.referringPhysician")}
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" mr={2}>
          <Stack direction="row" spacing={1}>
            <Avatar variant="rounded" sx={{bgcolor: "primary.main"}}>
              AA
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{fontWeight: 700}}>
                {patientCase.doctorFullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {patientCase.doctorEmail}
              </Typography>
            </Box>
          </Stack>
          <IconButton>
            <QuestionAnswerOutlinedIcon fontSize="medium" />
          </IconButton>
        </Stack>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        p={2}
        justifyContent="space-between"
      >
        <Box>
          <Typography color="grey.600" variant="body2">
            {t("components.caseCard.status")}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <StatusIcon />
            <Typography variant="body2">{StringUtils.capitalize(patientCase.status)}</Typography>
          </Stack>
        </Box>
        {patientCase.startDate && (
          <Box>
            <Typography color="grey.600" variant="body2">
              {t("components.caseCard.startDate")}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthOutlinedIcon sx={{color: "grey.600"}} />
              <Typography variant="body2">{new Date(patientCase.startDate).toLocaleDateString()}</Typography>
            </Stack>
          </Box>
        )}
        <Button variant="text" startIcon={<VisibilityOutlinedIcon />}>
          {t("components.caseCard.viewCase")}
        </Button>
      </Stack>
    </Card>
  );
}
