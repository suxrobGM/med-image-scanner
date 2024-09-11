"use client";
import {ReactElement, useState} from "react";
import {mutate} from "swr";
import {useSnackbar} from "notistack";
import {
  DataGridPro,
  GridActionsCellItem,
  GridActionsCellItemProps,
  GridColDef,
} from "@mui/x-data-grid-pro";
import {Box, Tooltip} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import DeleteIcon from "@mui/icons-material/Delete";
import {ApiService} from "@/core/services";
import {useSWRPagination} from "@/core/hooks";
import {UserDto, UserRoleType} from "@/core/models";
import {useConfirmDialog} from "@/components";
import {ChangeUserRoleDialog} from "./ChangeUserRoleDialog";
import {ChangeUserOrgDialog} from "./ChangeUserOrgDialog";


interface UsersGridProps {
  /**
   * Show only users from a specific organization.
   * Specify organization name or ID in the organization prop.
   */
  showOnlyOrgUsers?: boolean;

  /**
   * Filter users by organization ID or name.
   */
  organization?: {
    id?: string;
    name?: string;
  }

  /**
   * Height of the grid. The default is 600px.
   */
  height?: string;
}

export function UsersGrid(props: UsersGridProps) {
  const [openChangeRoleDialog, setOpenChangeRoleDialog] = useState(false);
  const [openChangeOrgDialog, setOpenChangeOrgDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10, zeroBased: true});
  const {confirm} = useConfirmDialog();
  const {enqueueSnackbar} = useSnackbar();
  const height = props.height ?? "600px";
  
  const {
    data: result,
    isLoading,
    key: fetchUsersKey
  } = useSWRPagination("users", paginationModel, (pageModel) =>
    ApiService.ins.getUsers({
      ...pageModel,
      organizationId: props.organization?.id,
      organizationName: props.organization?.name,
    })
  );

  const rowCount = (result?.pagesCount ?? 0) * paginationModel.pageSize;

  if (!result?.data || !result.success) {
    return <Box>{result?.error ?? "Failed to fetch data"}</Box>;
  }

  const openChangeUserRoleDialog = (user: UserDto) => {
    setSelectedUser(user);
    setOpenChangeRoleDialog(true);
  }

  const closeChangeUserRoleDialog = () => {
    setOpenChangeRoleDialog(false);
    setSelectedUser(null);
    mutate(fetchUsersKey);
  }

  const openChangeUserOrgDialog = (user: UserDto) => {
    setSelectedUser(user);
    setOpenChangeOrgDialog(true);
  }

  const closeChangeUserOrgDialog = () => {
    setOpenChangeOrgDialog(false);
    setSelectedUser(null);
    mutate(fetchUsersKey);
  }

  const removeUserFromOrganization = async (userId: string) => {
    const result = await ApiService.ins.updateUserOrganization({userId: userId, organization: null});

    if (result.success) {
      enqueueSnackbar("User removed from organization successfully", {variant: "success"});
      setSelectedUser(null);
      mutate(fetchUsersKey);
    }
    else {
      enqueueSnackbar(`Failed to remove user from organization, ${result.error}`, {variant: "error"});
    }
  }

  const showConfirmRemoveUserFromOrg = (user: UserDto) => () => {
    confirm({
      title: "Remove User from Organization",
      message: `Are you sure you want to remove user '${user.firstName} ${user.lastName}' from the organization?`,
      onConfirm: () => removeUserFromOrganization(user.id),
    });
  }

  const columns: GridColDef<UserDto>[] = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },
  ]

  if (!props.showOnlyOrgUsers) {
    columns.push({
      field: "organization",
      headerName: "Organization",
      flex: 1,
    });
  }

  return (
    <Box height={height}>
      {selectedUser && (
        <>
          <ChangeUserRoleDialog
            user={selectedUser}
            open={openChangeRoleDialog}
            onClose={closeChangeUserRoleDialog}
          />

          {!props.showOnlyOrgUsers && (
            <ChangeUserOrgDialog
              user={selectedUser}
              open={openChangeOrgDialog}
              onClose={closeChangeUserOrgDialog}
            />
          )}
        </>
      )}
      
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
          ...columns,
          {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            flex: 1,
            getActions: ({row}) => {
              const actions: ReactElement<GridActionsCellItemProps>[] = [];

              // Exclude any actions for super admin users
              if (row.role === UserRoleType.SUPER_ADMIN) {
                return actions;
              }

              actions.push(
                <Tooltip key="changeRole" title="Change Role" arrow >
                  <GridActionsCellItem
                    icon={<SecurityIcon />}
                    label="Change Role"
                    onClick={() => openChangeUserRoleDialog(row)}
                  />
                </Tooltip>
              );

              // Only show change organization action if not filtering by organization
              if (!props.showOnlyOrgUsers) {
                actions.push(
                  <Tooltip key="changeOrganization" title="Change Organization" arrow>
                    <GridActionsCellItem
                      icon={<CorporateFareIcon />}
                      label="Change Organization"
                      onClick={() => openChangeUserOrgDialog(row)}
                    />
                  </Tooltip>
                );
              }

              if (row.organization) {
                actions.push(
                  <Tooltip key="removeFromOrg" title="Remove from Organization" arrow>
                    <GridActionsCellItem
                      icon={<DeleteIcon />}
                      label="Remove from Organization"
                      onClick={showConfirmRemoveUserFromOrg(row)}
                    />
                  </Tooltip>
                );
              }
              return actions;
            },
          }
        ]}
      />
    </Box>
  );
}
