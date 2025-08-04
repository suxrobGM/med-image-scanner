"use client";

import {useCallback, useEffect, useState} from "react";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import {DataGridPro, DataGridProProps} from "@mui/x-data-grid-pro";
import {useTranslations} from "next-intl";
import useSWR from "swr";
import {getOhifViewerModes} from "@/components";
import {StudyDto} from "@/core/models";
import {ApiService} from "@/core/services";
import {StudySeriesGrid} from "./StudySeriesGrid";

interface StudiesTabProps {
  patientId: string;
  organization: string;
  onDataFetched?: (totalItems: number, dataType: string) => void;
}

export function StudiesTab(props: StudiesTabProps) {
  const t = useTranslations();
  const [viewerMenuAnchorEl, setViewerMenuAnchorEl] = useState<HTMLElement | null>(null);

  const {data: result, isLoading} = useSWR(`/studies?patientId=${props.patientId}`, () =>
    ApiService.ins.getStudies({patientId: props.patientId, organization: props.organization})
  );

  const getDetailPanelContent = useCallback<
    NonNullable<DataGridProProps<StudyDto>["getDetailPanelContent"]>
  >(({row}) => {
    return (
      <Box p={2} height="100%">
        <StudySeriesGrid studyId={row.studyInstanceUid} organization={props.organization} />
      </Box>
    );
  }, []);

  const getDetailPanelHeight = useCallback(() => 400, []);

  const handleCloseViewerMenu = () => {
    setViewerMenuAnchorEl(null);
  };

  const handleOpenViewerMenu = (event: React.MouseEvent<HTMLElement>) => {
    setViewerMenuAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (result?.success && result.data) {
      const totalItems = result.data.length;
      props.onDataFetched?.(totalItems, "Studies");
    }
  }, [result, props.onDataFetched]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!result?.data || !result.success) {
    return <Box>{result?.error}</Box>;
  }

  return (
    <Card>
      <DataGridPro
        autoHeight
        getRowId={(row) => row.studyInstanceUid}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        loading={isLoading}
        rows={result.data}
        columns={[
          {
            field: "description",
            headerName: t("components.imagingTable.study"),
            flex: 1,
          },
          {
            field: "studyDate",
            headerName: "Study date",
            display: "flex",
            flex: 1,
            renderCell: (params) => (
              <Stack direction="row" spacing={2} alignItems="center">
                <TodayOutlinedIcon />
                <Typography variant="body2">
                  {new Date(params.value).toLocaleDateString()}
                </Typography>
              </Stack>
            ),
          },
          {
            field: "modalities",
            headerName: "Modalities",
            flex: 1,
          },
          {
            field: "seriesCount",
            headerName: t("components.imagingTable.series"),
            flex: 1,
          },
          {
            field: "instancesCount",
            headerName: "Instances",
            flex: 1,
          },
          {
            field: "accessionNumber",
            headerName: "Accession #",
            flex: 1,
          },
          {
            field: "loadInViewer",
            headerName: "Load in Viewer",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({row}) => (
              <>
                <IconButton onClick={handleOpenViewerMenu}>
                  <VisibilityOutlinedIcon color="warning" />
                </IconButton>
                <Menu
                  id="loadInViewerMenu"
                  anchorEl={viewerMenuAnchorEl}
                  open={viewerMenuAnchorEl !== null}
                  onClose={handleCloseViewerMenu}
                >
                  {getOhifViewerModes(row.modalities).map((viewerMode) => (
                    <MenuItem key={viewerMode.mode} onClick={handleCloseViewerMenu}>
                      <Link
                        href={`/viewer/${row.studyInstanceUid}?mode=${viewerMode.mode}`}
                        sx={{textDecoration: "none"}}
                      >
                        {viewerMode.label}
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ),
          },
        ]}
      />
    </Card>
  );
}
