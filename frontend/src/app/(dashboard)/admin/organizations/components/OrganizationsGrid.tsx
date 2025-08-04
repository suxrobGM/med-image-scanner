"use client";

import {ReactElement, useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Box, Tooltip} from "@mui/material";
import {DataGridPro, GridActionsCellItem, GridActionsCellItemProps} from "@mui/x-data-grid-pro";
import {useRouter} from "next/navigation";
import {useSnackbar} from "notistack";
import {mutate} from "swr";
import {useConfirmDialog} from "@/components";
import {DEFAULT_ORGANIZATION} from "@/core/consts";
import {useSWRPagination} from "@/core/hooks";
import {OrganizationDto} from "@/core/models";
import {ApiService} from "@/core/services";

export function OrganizationsGrid() {
  const router = useRouter();
  const {confirm} = useConfirmDialog();
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10, zeroBased: true});
  const [isDeleting, setIsDeleting] = useState(false);
  const {enqueueSnackbar} = useSnackbar();

  const {
    data: result,
    isLoading,
    key: fetchOrganizationsKey,
  } = useSWRPagination("organizations", paginationModel, (pageModel) =>
    ApiService.ins.getOrganizations(pageModel)
  );

  const rowCount = (result?.pagesCount ?? 0) * paginationModel.pageSize;

  if (!result?.data || !result.success) {
    return <Box>{result?.error ?? "Failed to fetch data"}</Box>;
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/organizations/${id}`);
  };

  const showConfirmDelete = (organization: OrganizationDto) => () => {
    confirm({
      title: "Delete Organization",
      message: `Are you sure you want to delete the '${organization.name}' organization?`,
      isLoading: isDeleting,
      onConfirm: () => deleteOrganization(organization.id),
    });
  };

  const deleteOrganization = async (id: string) => {
    setIsDeleting(true);
    const result = await ApiService.ins.deleteOrganization(id);

    if (result.success) {
      mutate(fetchOrganizationsKey);
      enqueueSnackbar("Organization deleted successfully", {variant: "success"});
    } else {
      enqueueSnackbar(`Failed to delete organization, ${result.error}`, {variant: "error"});
    }

    setIsDeleting(false);
  };

  return (
    <DataGridPro
      pageSizeOptions={[10, 50, 100]}
      loading={isLoading}
      pagination={true}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={(model) => setPaginationModel({...model, zeroBased: true})}
      rows={result.data}
      rowCount={rowCount}
      columns={[
        {
          field: "name",
          headerName: "Name",
          flex: 1,
        },
        {
          field: "displayName",
          headerName: "Display Name",
          flex: 1,
        },
        {
          field: "dicomUrl",
          headerName: "DICOM URL",
          flex: 1,
        },
        {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          getActions: ({row}) => {
            const actions: ReactElement<GridActionsCellItemProps>[] = [];

            actions.push(
              <Tooltip title="Edit" arrow>
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  onClick={() => handleEdit(row.id)}
                />
              </Tooltip>
            );

            if (row.name !== DEFAULT_ORGANIZATION) {
              actions.push(
                <Tooltip title="Delete" arrow>
                  <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={showConfirmDelete(row)}
                  />
                </Tooltip>
              );
            }
            return actions;
          },
        },
      ]}
    />
  );
}
