"use client";

import {useEffect, useState} from "react";
import {CloudDownloadOutlined, DescriptionOutlined} from "@mui/icons-material";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {Box, Card, CircularProgress, Stack, Typography} from "@mui/material";
import {DataGridPro as DataGrid, GridActionsCellItem} from "@mui/x-data-grid-pro";
import {useTranslations} from "next-intl";
import {useSWRPagination} from "@/core/hooks";
import {ApiService} from "@/core/services";

interface DocumentsTabProps {
  patientId: string;
  onDataFetched?: (totalItems: number, dataType: string) => void;
}

export function DocumentsTab(props: DocumentsTabProps) {
  const t = useTranslations();
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10, zeroBased: true});

  const {data: result, isLoading} = useSWRPagination(
    `/patients/${props.patientId}/documents`,
    paginationModel,
    (pageModel) => ApiService.ins.getPatientDocuments(props.patientId, pageModel)
  );

  const rowCount = (result?.pagesCount ?? 0) * paginationModel.pageSize; // total items

  useEffect(() => {
    if (result?.success && result.data) {
      const totalItems = result.pagesCount * result.pageSize;
      props.onDataFetched?.(totalItems, "Documents");
    }
  }, [result, props.onDataFetched]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!result || !result.success) {
    return <Box>{result?.error}</Box>;
  }

  return (
    <Card>
      <DataGrid
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 50, 100]}
        loading={isLoading}
        pagination={true}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel({...model, zeroBased: true})}
        rows={result.data!}
        rowCount={rowCount}
        columns={[
          {
            field: "name",
            headerName: t("components.documentsTable.documentName"),
            renderCell: (params) => (
              <Stack direction="row" spacing={2} alignItems="center">
                <DescriptionOutlined />
                <Typography variant="body2">{params.value}</Typography>
              </Stack>
            ),
            flex: 0.35,
          },
          {
            field: "createdAt",
            headerName: t("components.documentsTable.date"),
            flex: 0.3,
            renderCell: (params) => (
              <Stack direction="row" spacing={1} alignItems="center">
                <TodayOutlinedIcon />
                <Typography variant="body2">
                  {new Date(params.value).toLocaleDateString()}
                </Typography>
              </Stack>
            ),
          },
          {
            field: "description",
            headerName: t("components.documentsTable.description"),
            flex: 1,
          },
          {
            field: "actions",
            type: "actions",
            headerName: t("components.documentsTable.options"),
            flex: 0.2,
            getActions: () => {
              return [
                <GridActionsCellItem
                  key={1}
                  icon={<VisibilityOutlinedIcon />}
                  label="Save"
                  sx={{
                    color: "primary.main",
                  }}
                />,
                <GridActionsCellItem
                  key={2}
                  icon={<CloudDownloadOutlined />}
                  label="Cancel"
                  className="textPrimary"
                  color="inherit"
                />,
              ];
            },
          },
        ]}
      />
    </Card>
  );
}
