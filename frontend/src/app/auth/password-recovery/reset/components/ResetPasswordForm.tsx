"use client";
import {useState} from "react";
import {useFormState, useFormStatus} from "react-dom";
import {Button, Stack, Typography} from "@mui/material";
import {resetPasswordAction} from "@/app/auth/actions";
import {AlertResult, PasswordValidator} from "@/components";


interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({token}: ResetPasswordFormProps) {
  const [canSubmit, setCanSubmit] = useState(false);
  const [formState, formAction] = useFormState(resetPasswordAction, null);
  const {pending} = useFormStatus();

  return (
    <form action={formAction}>
      <Stack direction="column" gap={2}>
        <Typography variant="h4">Set Password</Typography>

        <input type="hidden" name="token" defaultValue={token} />
        <PasswordValidator
          name="password"
          onValid={() => setCanSubmit(true)}
          onInvalid={() => setCanSubmit(false)}
        />

        <AlertResult
          result={formState}
          successText="Password reset successfully"
          errorText="Failed to reset password"
        />

        <Button type="submit" variant="contained" disabled={pending || !canSubmit}>
          Reset Password
        </Button>
      </Stack>
    </form>
  );
}
