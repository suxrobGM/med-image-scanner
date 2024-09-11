"use client";
import {useCallback, useState} from "react";
import {useTranslations} from "next-intl";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Box, Stack, Tab} from "@mui/material";
import {StudiesTab} from "./StudiesTab";
import {DocumentsTab} from "./DocumentsTab";

interface PatientTabContentProps {
  patientId: string;
  organization: string;
}

enum TabValue {
  STUDIES = "studies",
  DOCUMENTS = "documents",
}

export function PatientTabContent(props: PatientTabContentProps) {
  const t = useTranslations();
  const [tabValue, setTabValue] = useState(TabValue.STUDIES);
  const [tabContentHeader, setTabContentHeader] = useState("");

  const handleTabChange = useCallback((_: any, newValue: TabValue) => setTabValue(newValue), []);
  const handleTabDataFetched = useCallback((totalItems: number, dataType: string) => setTabContentHeader(`${totalItems} ${dataType}`), []);

  return (
    <TabContext value={tabValue}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <TabList onChange={handleTabChange}>
          <Tab label={t("dashboard.tabAllImaging")} value={TabValue.STUDIES} sx={{textTransform: "none"}} />
          {/* <Tab label={t("dashboard.tabCases")} value={TabValue.CASES} sx={{textTransform: "none"}} /> */}
          <Tab label={t("dashboard.tabDocuments")} value={TabValue.DOCUMENTS} sx={{textTransform: "none"}} />
        </TabList>
        <Box display="flex" justifyContent="flex-end" p={2}>
          {tabContentHeader}
        </Box>
      </Stack>
      <TabPanel value={TabValue.STUDIES}>
        <StudiesTab 
          patientId={props.patientId}
          organization={props.organization}
          onDataFetched={handleTabDataFetched} 
        />
      </TabPanel>
      <TabPanel value={TabValue.DOCUMENTS}>
        <DocumentsTab 
          patientId={props.patientId}
          onDataFetched={handleTabDataFetched}
        />
      </TabPanel>
    </TabContext>
  );
}
