"use client";
import {useFormState} from "react-dom";
import {Stack, Typography} from "@mui/material";
import {UserDto} from "@/core/models";
import {updatePasswordAction} from "@/app/(dashboard)/profile/actions";
import {AlertResult, PasswordInput, PasswordValidator, SubmitButton} from "@/components";

interface UserPasswordTabProps {
  user: UserDto;
}

export function UserPasswordTab({user}: UserPasswordTabProps) {
  const [formState, formAction] = useFormState(updatePasswordAction, null);
  
  return (
    <form action={formAction}>
      <Stack direction="column" gap={3}>
        <Typography variant="h4">Update Password</Typography>

        <AlertResult
          result={formState}
          successText="Password updated successfully"
          errorText="Failed to update password"
        />

        <input type="hidden" name="userId" defaultValue={user.id} />
        <PasswordInput name="oldPassword" label="Current Password" required />
        <PasswordValidator name="newPassword" required />

        <SubmitButton 
          variant="contained"
          sx={{alignSelf: "flex-start"}}
        >
          Update Password
        </SubmitButton>
      </Stack>
    </form>
  );
}
