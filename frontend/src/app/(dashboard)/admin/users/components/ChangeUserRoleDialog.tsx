"use client";
import {useFormState} from "react-dom";
//@ts-ignore
import {useSession} from "next-auth/react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import {UserDto, UserRoleType} from "@/core/models";
import {UserUtils} from "@/core/utils";
import {AlertResult, SubmitButton} from "@/components";
import {updateUserRoleAction} from "@/app/(dashboard)/admin/actions";


interface ChangeUserRoleDialogProps {
  user: UserDto;
  open: boolean;
  onClose: () => void;
}

export function ChangeUserRoleDialog(props: ChangeUserRoleDialogProps) {
  const {data: session} = useSession();
  const [result, formAction] = useFormState(updateUserRoleAction, null);
  const currentUserRole = session?.user?.role; // current user role

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Change Role</DialogTitle>
      <DialogContent>
        <form action={formAction}>
          <Stack direction="column" gap={2}>
            <DialogContentText>
              Select a new role for the user <strong>{props.user.firstName} {props.user.lastName}</strong>
            </DialogContentText>

            <AlertResult
              result={result}
              successText="Role updated successfully!"
              errorText="Error updating role"
            />

            <input type="hidden" name="userId" defaultValue={props.user.id} />
            <FormControl fullWidth>
              <InputLabel id="roleLabel">Role</InputLabel>
              <Select
                label="Role"
                labelId="roleLabel"
                name="role"
                defaultValue={props.user.role}
              >
                <MenuItem value=""><em>None</em></MenuItem>

                {UserUtils.isAppAdmin(currentUserRole) && (
                  <MenuItem value={UserRoleType.APP_ADMIN}>App Admin</MenuItem> 
                )}
                
                <MenuItem value={UserRoleType.ORG_ADMIN} disabled={!props.user.organization}>Organization Admin</MenuItem>
              </Select>
            </FormControl>

            {props.user.organization && (
              <TextField name="organization" label="Organization" value={props.user.organization} fullWidth disabled />
            )}

            <Stack direction="row" gap={2}>
              <Button onClick={() => props.onClose()}>Close</Button>
              <SubmitButton color="primary">Save</SubmitButton>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}
