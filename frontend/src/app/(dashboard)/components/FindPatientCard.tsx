"use client";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {PersonSearchOutlined, SearchOutlined} from "@mui/icons-material";
import {Stack, Box, TextField, Typography} from "@mui/material";
import {DashboardCard} from "./DashboardCard";

export function FindPatientCard() {
  const router = useRouter();
  const t = useTranslations();

  return (
    <DashboardCard>
      <Stack direction="column" justifyContent="space-between" alignItems="stretch" sx={{height: "100%"}}>
        <Box>
          <Stack spacing={1} direction="row" alignItems="center" mb={2}>
            <PersonSearchOutlined sx={{color: "white"}} />
            <Typography
              variant="h6"
              sx={{fontWeight: 700, color: "white", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)"}}
            >
              {t("dashboard.findAPatient")}
            </Typography>
          </Stack>
          <Typography variant="body1" fontSize={18} sx={{color: "white", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)"}}>
            {t("dashboard.findAPatientDesc", {
              // apos: '&apos;',
              // interpolation: { escapeValue: false },
            })}
          </Typography>
        </Box>
        <Box>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            placeholder={t("dashboard.patientMRN")}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                const inputEl = event.target as HTMLInputElement;
                router.push(`/patient/search/result?q=${inputEl.value}`);
                event.preventDefault();
              }
            }}
            InputProps={{
              startAdornment: <SearchOutlined />,
              sx: {
                backgroundColor: "rgb(64,174,200)",
                borderRadius: 2,
                placeholder: {
                  color: "black",
                  fontWeight: "bold",
                },
              },
            }}
          />
        </Box>
      </Stack>
    </DashboardCard>
  );
}
