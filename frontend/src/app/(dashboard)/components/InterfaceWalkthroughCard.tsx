"use client";

import {ArrowForward, SmartDisplayOutlined} from "@mui/icons-material";
import {Box, Stack, Typography} from "@mui/material";
import {useTranslations} from "next-intl";
import {DashboardCard, DashboardCardColorButton} from "./DashboardCard";

export function InterfaceWalkthroughCard() {
  const t = useTranslations();

  return (
    <DashboardCard backgroundImage="linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,0.6) 50%, rgba(252,176,69,0.2) 100%);">
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="stretch"
        sx={{height: "100%"}}
      >
        <Box>
          <Stack spacing={1} direction="row" alignItems="center" mb={2}>
            <SmartDisplayOutlined sx={{color: "white"}} />
            <Typography
              variant="h6"
              sx={{fontWeight: 700, color: "white", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)"}}
            >
              {t("dashboard.interfaceWalkthrough")}
            </Typography>
          </Stack>
          <Box mb={4}>
            <Typography
              variant="body1"
              fontSize={18}
              sx={{color: "white", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)"}}
            >
              {t("dashboard.quickTour")}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            maxWidth: {
              xs: "100%",
              lg: "50%",
            },
          }}
        >
          <DashboardCardColorButton
            endIcon={<ArrowForward />}
            variant="contained"
            size="large"
            fullWidth
          >
            {t("dashboard.startTour")}
          </DashboardCardColorButton>
        </Box>
      </Stack>
    </DashboardCard>
  );
}
