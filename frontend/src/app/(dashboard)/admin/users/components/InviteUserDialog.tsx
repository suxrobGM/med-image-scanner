"use client";
import {useState} from "react";
import {useFormState, useFormStatus} from "react-dom";
//@ts-ignore
import {useSession} from "next-auth/react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import {AlertResult, OrganizationSearchInput} from "@/components";
import {UserRoleType} from "@/core/models";
import {UserUtils} from "@/core/utils";
import {inviteUserAction} from "@/app/(dashboard)/admin/actions";


interface InviteUserDialogProps {
  /**
   * The organization name to which the user will be invited.
   * If not provided, the user will be able to select an organization from search input.
   */
  organization?: string;
}

export function InviteUserDialog(props: InviteUserDialogProps) {
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);
  const [result, formAction] = useFormState(inviteUserAction, null);
  const {pending} = useFormStatus();
  const [organizationName, setOrganizationName] = useState<string>("");
  const currentUserRole = session?.user?.role;
  
  return (
    <Box>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Invite User
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Invite a new user</DialogTitle>
        <DialogContent>
          <form action={formAction}>
            <Stack direction="column" gap={2}>
              <AlertResult
                result={result}
                successText="Invitation sent successfully!"
                errorText="Error sending invitation"
              />

              <TextField name="email" label="Email" type="email" fullWidth required />

              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select name="role" labelId="role-label" label="Role" defaultValue={""}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>

                  {!props.organization && UserUtils.isAppAdmin(currentUserRole) && (
                    <MenuItem value={UserRoleType.APP_ADMIN}>App Admin</MenuItem>
                  )}

                  <MenuItem value={UserRoleType.ORG_ADMIN}>Organization Admin</MenuItem>
                </Select>
              </FormControl>

              {props.organization && (
                <TextField name="organization" label="Organization" value={props.organization} fullWidth disabled />
              )}
              {!props.organization && (
                <>
                  <input type="hidden" name="organization" defaultValue={organizationName} />
                  <OrganizationSearchInput onChange={(value) => setOrganizationName(value?.name ?? "")} />
                </>
              )}

              <Stack direction="row" gap={2}>
                <Button onClick={() => setOpen(false)} disabled={pending}>Close</Button>
                <Button type="submit" disabled={pending}>Send invitation</Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
