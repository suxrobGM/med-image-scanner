"use client";

import {useState} from "react";
import SendIcon from "@mui/icons-material/Send";
import {Avatar, Box, Divider, Grid, Stack, TextField, Typography} from "@mui/material";
import {teal} from "@mui/material/colors";
import {useSnackbar} from "notistack";
import {updateReportAction} from "@/app/(dashboard)/report/actions";
import {SubmitButton} from "@/components";
import {FindingDto, ReportDto, UpdateReportCommand, UserDto} from "@/core/models";
import {DateUtils, UserUtils} from "@/core/utils";
import {FindingCard} from "./FindingCard";
import {SignButton} from "./SignButton";

interface ReportFormProps {
  report: ReportDto;
  user: UserDto;
}

export function ReportForm(props: ReportFormProps) {
  const [report, setReport] = useState(props.report);
  const {enqueueSnackbar} = useSnackbar();

  const handleReportChange = (field: keyof ReportDto, value: any) => {
    setReport((prev) => ({...prev, [field]: value}));
  };

  const handleSign = (dataUrl: string) => {
    setReport((prev) => ({
      ...prev,
      signedAt: new Date().toISOString(),
      referringPhysician: props.user,
    }));
  };

  const handleFindingChange = (finding: FindingDto) => {
    const index = report.findings.findIndex((f) => f.id === finding.id);
    const newFindings = [...report.findings];

    if (index === -1) {
      newFindings.push(finding);
    } else {
      newFindings[index] = finding;
    }

    setReport((prev) => ({...prev, findings: newFindings}));
  };

  const handleFormSubmit = async (data: FormData) => {
    const command: UpdateReportCommand = {
      id: report.id,
      clinincalInfo: report.clinincalInfo,
      indication: report.indication,
      technique: report.technique,
      findings: report.findings,
      impression: report.impression,
      recommendation: report.recommendation,
      signedAt: report.signedAt,
      referringPhysicianId: report.referringPhysician?.id,
    };

    const result = await updateReportAction(command);

    if (result.success) {
      enqueueSnackbar("Report updated successfully", {variant: "success"});
    } else {
      enqueueSnackbar(result.error!, {variant: "error"});
    }
  };

  return (
    <form action={handleFormSubmit}>
      <Grid container py={1}>
        <Grid item xs={12} md={4} pr={1}>
          <Typography variant="h5">Clinical Information</Typography>
          <TextField
            rows={3}
            value={report.clinincalInfo ?? ""}
            onChange={(e) => handleReportChange("clinincalInfo", e.target.value)}
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4} px={1}>
          <Typography variant="h5">Indication</Typography>
          <TextField
            rows={3}
            value={report.indication ?? ""}
            onChange={(e) => handleReportChange("indication", e.target.value)}
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4} pl={1}>
          <Typography variant="h5">Technique</Typography>
          <TextField
            rows={3}
            value={report.technique ?? ""}
            onChange={(e) => handleReportChange("technique", e.target.value)}
            multiline
            fullWidth
          />
        </Grid>
      </Grid>

      <Box py={4}>
        <Divider orientation="horizontal" />
      </Box>

      <Stack direction="column" gap={2}>
        <Typography variant="h5">Findings</Typography>

        {report.findings.map((finding) => (
          <FindingCard key={finding.id} finding={finding} onChange={handleFindingChange} />
        ))}
      </Stack>

      <Box py={4}>
        <Divider orientation="horizontal" />
      </Box>

      <Stack direction="column" gap={2}>
        <Typography variant="h5">Impressions</Typography>
        <TextField
          rows={3}
          value={report.impression ?? ""}
          onChange={(e) => handleReportChange("impression", e.target.value)}
          multiline
          fullWidth
        />
      </Stack>

      <Stack direction="column" gap={2} mt={3}>
        <Typography variant="h5">Recommendation</Typography>
        <TextField
          rows={3}
          value={report.recommendation ?? ""}
          onChange={(e) => handleReportChange("recommendation", e.target.value)}
          multiline
          fullWidth
        />
      </Stack>

      <Box py={4}>
        <Divider orientation="horizontal" />
      </Box>

      <Stack direction="column" pb={3}>
        <Typography variant="caption" color="GrayText" mt={3}>
          Referring Physician
        </Typography>

        <Stack direction="row" gap={2} alignItems="center">
          <Avatar variant="rounded" sx={{bgcolor: teal[500]}}>
            {UserUtils.getInitials(props.user)}
          </Avatar>
          <Stack direction="column">
            <Typography variant="body1">
              {props.user.firstName} {props.user.lastName}
            </Typography>
            <Typography variant="caption" color="GrayText">
              {props.user.email}
            </Typography>
          </Stack>

          {report.signedAt ? (
            <Typography variant="body2" color="GrayText">
              Signed at {DateUtils.formatDateTime(report.signedAt)}
            </Typography>
          ) : (
            <SignButton onSign={handleSign} />
          )}

          <SubmitButton variant="contained" color="info" endIcon={<SendIcon />} sx={{ml: "auto"}}>
            Save
          </SubmitButton>
        </Stack>
      </Stack>
    </form>
  );
}
