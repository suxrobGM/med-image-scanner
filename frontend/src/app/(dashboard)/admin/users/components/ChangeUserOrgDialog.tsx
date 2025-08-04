"use client";

import {useState} from "react";
import {Button, Dialog, DialogContent, DialogContentText, DialogTitle, Stack} from "@mui/material";
import {useFormState} from "react-dom";
import {updateUserOrgAction} from "@/app/(dashboard)/admin/actions";
import {AlertResult, OrganizationSearchInput, SubmitButton} from "@/components";
import {UserDto} from "@/core/models";

interface ChangeUserOrgDialogProps {
  user: UserDto;
  open: boolean;
  onClose: () => void;
}

export function ChangeUserOrgDialog(props: ChangeUserOrgDialogProps) {
  const [organizationName, setOrganizationName] = useState<string>(props.user.organization ?? "");
  const [result, formAction] = useFormState(updateUserOrgAction, null);

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Change User Organization</DialogTitle>
      <DialogContent>
        <form action={formAction}>
          <Stack direction="column" gap={2}>
            <DialogContentText>
              Select an organization for the user{" "}
              <strong>
                {props.user.firstName} {props.user.lastName}
              </strong>{" "}
              to join.
            </DialogContentText>

            <AlertResult
              result={result}
              successText="User organization updated successfully!"
              errorText="Error updating user organization"
            />

            <input type="hidden" name="userId" defaultValue={props.user.id} />
            <input type="hidden" name="organization" defaultValue={organizationName} />
            <OrganizationSearchInput onChange={(value) => setOrganizationName(value?.name ?? "")} />

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
