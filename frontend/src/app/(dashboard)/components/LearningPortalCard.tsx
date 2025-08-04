"use client";

import {ArrowForward, SchoolOutlined} from "@mui/icons-material";
import {Box, Stack, Typography} from "@mui/material";
import {useTranslations} from "next-intl";
import {DashboardCard, DashboardCardColorButton} from "./DashboardCard";

export function LearningPortalCard() {
  const t = useTranslations();

  return (
    <DashboardCard backgroundImage="linear-gradient(180deg, rgba(26,108,192,1) 0%, rgba(191,197,212,0.2) 100%);">
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="stretch"
        sx={{height: "100%"}}
      >
        <Box>
          <Stack spacing={1} direction="row" alignItems="center" mb={2}>
            <SchoolOutlined sx={{color: "white"}} />
            <Typography
              variant="h6"
              sx={{fontWeight: 700, color: "white", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)"}}
            >
              {t("dashboard.learningPortal")}
            </Typography>
          </Stack>
          <Box mb={4}>
            <Typography
              variant="body1"
              fontSize={18}
              sx={{color: "white", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)"}}
            >
              {t("dashboard.learningPortalDescription")}
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
            sx={{
              backgroundImage:
                "linear-gradient(90deg, rgba(101,204,219,0.75) 0%, rgba(54,122,209,0.7) 100%);",
            }}
          >
            {t("dashboard.learnMore")}
          </DashboardCardColorButton>
        </Box>
      </Stack>
    </DashboardCard>
  );
}
