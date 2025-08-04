"use client";

import {useEffect, useState} from "react";
import ErrorIcon from "@mui/icons-material/Error";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {Box, Button, CircularProgress, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import {DataGridPro} from "@mui/x-data-grid-pro";
import {useTranslations} from "next-intl";
import useSWR from "swr";
import AiMagicIcon from "@/components/icons/AiMagicIcon";
import {MLModelType, PredictionStatus} from "@/core/models";
import {ApiService} from "@/core/services";

interface StudySeriesGridProps {
  studyId: string;
  organization: string;
}

export function StudySeriesGrid(props: StudySeriesGridProps) {
  const t = useTranslations();
  const [inProgressSeries, setInProgressSeries] = useState<Record<string, boolean>>({});

  const {
    data: result,
    isLoading,
    mutate,
  } = useSWR(`/studies/${props.studyId}/series`, () =>
    ApiService.ins.getStudySeries({studyId: props.studyId, organization: props.organization})
  );

  // Check if there are any series with IN_PROGRESS status
  const hasAnyInProgress = () => {
    return (
      Object.keys(inProgressSeries).length > 0 ||
      result?.data?.some((row) => row.predictionStatus === PredictionStatus.IN_PROGRESS)
    );
  };

  // Refresh the data every 10 seconds if there are series in progress
  useEffect(() => {
    if (!hasAnyInProgress()) {
      return;
    }

    const interval = setInterval(() => {
      if (!hasAnyInProgress()) {
        clearInterval(interval);
        return;
      }

      mutate();
      console.log("Refreshed series data");
    }, 10000);

    return () => {
      clearInterval(interval);
      console.log("Cleared the refresh series data interval");
    };
  }, [mutate, hasAnyInProgress]);

  const handleScan = async (seriesInstanceUid: string) => {
    setInProgressSeries((prev) => ({...prev, [seriesInstanceUid]: true}));

    await ApiService.ins.predictSeries({
      organization: props.organization,
      studyInstanceUid: props.studyId,
      seriesInstanceUid,
      modelType: MLModelType.CHEST_XRAY_CLASSIFICATION,
    });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!result?.data || !result.success) {
    return (
      <Typography variant="body1" color="error">
        {result?.error}
      </Typography>
    );
  }

  return (
    <DataGridPro
      getRowId={(row) => row.seriesInstanceUid}
      loading={isLoading}
      rows={result.data}
      columns={[
        {
          field: "description",
          headerName: "Description",
          flex: 1,
        },
        {
          field: "seriesDate",
          headerName: "Series Date",
          display: "flex",
          flex: 1,
          renderCell: (params) => (
            <Stack direction="row" spacing={2} alignItems="center">
              <TodayOutlinedIcon />
              <Typography variant="body2">{new Date(params.value).toLocaleDateString()}</Typography>
            </Stack>
          ),
        },
        {
          field: "modality",
          headerName: "Modality",
          flex: 1,
        },
        {
          field: "bodyPart",
          headerName: "Body Part",
          flex: 1,
        },
        {
          field: "instancesCount",
          headerName: "Instances",
          flex: 1,
        },
        {
          field: "predictionStatus",
          headerName: "Prediction Status",
          headerAlign: "center",
          align: "center",
          renderCell: ({row}) => {
            if (row.predictionStatus === PredictionStatus.COMPLETED) {
              return (
                <Button href={`/report/${row.reportId}`} endIcon={<AiMagicIcon color="success" />}>
                  {t("components.imagingTable.viewReport")}
                </Button>
              );
            } else if (row.predictionStatus === PredictionStatus.NOT_SUPPORTED) {
              return (
                <Tooltip title="This imaging modality is not supported currently" arrow>
                  <IconButton onClick={() => handleScan(row.seriesInstanceUid)}>
                    <ImageNotSupportedIcon color="warning" />
                  </IconButton>
                </Tooltip>
              );
            } else if (row.predictionStatus === PredictionStatus.FAILED) {
              return (
                <Tooltip
                  title="An error occurred while processing this series, please try again later"
                  arrow
                >
                  <IconButton onClick={() => handleScan(row.seriesInstanceUid)}>
                    <ErrorIcon color="error" />
                  </IconButton>
                </Tooltip>
              );
            } else if (
              inProgressSeries[row.seriesInstanceUid] ||
              row.predictionStatus === PredictionStatus.IN_PROGRESS
            ) {
              return (
                <Tooltip title="Processing, it may take few minutes" arrow>
                  <CircularProgress color="primary" />
                </Tooltip>
              );
            }

            return (
              <Button
                endIcon={<AiMagicIcon color="primary" />}
                onClick={() => handleScan(row.seriesInstanceUid)}
              >
                Scan
              </Button>
            );
          },
        },
        {
          field: "loadInViewer",
          headerName: t("components.imagingTable.loadInViewer"),
          headerAlign: "center",
          align: "center",
          flex: 1,
          renderCell: ({row}) => (
            <IconButton href={`/viewer/${props.studyId}?seriesId=${row.seriesInstanceUid}`}>
              <VisibilityOutlinedIcon color="warning" />
            </IconButton>
          ),
        },
      ]}
    />
  );
}
