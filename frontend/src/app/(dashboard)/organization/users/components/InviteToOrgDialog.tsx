"use client";
import {useState} from "react";
import {useFormState, useFormStatus} from "react-dom";
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
import {AlertResult} from "@/components";
import {UserRoleType} from "@/core/models";
import {inviteToOrgAction} from "@/app/(dashboard)/organization/actions";


interface InviteToOrgDialogProps {
  /**
   * The organization name to which the user will be invited.
   * If not provided, the user will be able to select an organization from search input.
   */
  organization: string;
}

export function InviteToOrgDialog(props: InviteToOrgDialogProps) {
  const [open, setOpen] = useState(false);
  const [result, formAction] = useFormState(inviteToOrgAction, null);
  const {pending} = useFormStatus();
  
  return (
    <Box>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Invite User
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          Invite user to organization <strong>{props.organization}</strong>
        </DialogTitle>
        <DialogContent>
          <form action={formAction}>
            <Stack direction="column" gap={2}>
              <AlertResult
                result={result}
                successText="Invitation sent successfully!"
                errorText="Error sending invitation"
              />

              <input type="hidden" name="organization" value={props.organization} />
              <TextField name="email" label="Email" type="email" fullWidth required />

              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select name="role" labelId="role-label" label="Role" defaultValue={""}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>

                  <MenuItem value={UserRoleType.ORG_ADMIN}>Organization Admin</MenuItem>
                </Select>
              </FormControl>

              <Stack direction="row" gap={2}>
                <Button onClick={() => setOpen(false)} disabled={pending}>
                  Close
                </Button>
                <Button type="submit" disabled={pending}>
                  Send invitation
                </Button>
              </Stack>
            </Stack>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
