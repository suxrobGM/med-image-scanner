"use client";

import {KeyboardReturnOutlined, PersonSearchOutlined} from "@mui/icons-material";
import {Box, Stack, TextField, Typography} from "@mui/material";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {DbSearchIcon} from "@/components/icons";

export default function PatientSearchForm() {
  const router = useRouter();
  const t = useTranslations();

  return (
    <Box
      sx={{
        width: {
          md: 450,
        },
      }}
    >
      <Stack spacing={1} direction="row" mb={2} alignItems="center" justifyContent="center">
        <PersonSearchOutlined sx={{fontSize: 68}} />
        <Box>
          <Typography variant="h4" mb={0.5} fontWeight={600}>
            {t("dashboard.findAPatient")}
          </Typography>
          <Typography variant="body2">{t("dashboard.addPatientMRNInstruction")}</Typography>
        </Box>
      </Stack>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "right",
        }}
      >
        <TextField
          placeholder={t("components.topBar.search")}
          size="small"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: <DbSearchIcon sx={{fill: "grey", mr: 1}} />,
            endAdornment: <KeyboardReturnOutlined color="disabled" />,
            sx: {bgcolor: "white"},
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              const inputEl = event.target as HTMLInputElement;
              router.push(`/dashboard/patient/search/result?search=${inputEl.value}`);
              event.preventDefault();
            }
          }}
          sx={{mt: 2}}
        />
        <Typography variant="caption" align="right">
          {t("dashboard.hitEnterInstruction")}
        </Typography>
      </Box>
    </Box>
  );
}
